/**
 * Operational Transformation (OT) Engine
 * Handles real-time collaborative editing with conflict resolution
 */

export interface Operation {
  type: 'insert' | 'delete' | 'retain';
  position?: number;
  text?: string;
  length?: number;
  userId: string;
  timestamp: number;
  version: number;
}

export interface TransformedOperation {
  operation: Operation;
  transformed: boolean;
}

/**
 * Transform two concurrent operations
 * Based on the OT algorithm for text editing
 */
export class OperationalTransform {
  /**
   * Transform operation A against operation B
   * Returns the transformed version of A that can be applied after B
   */
  static transform(opA: Operation, opB: Operation): Operation {
    // If operations are from the same user, no transformation needed
    if (opA.userId === opB.userId) {
      return opA;
    }

    const transformedOp = { ...opA };

    // Insert vs Insert
    if (opA.type === 'insert' && opB.type === 'insert') {
      if (opB.position! <= opA.position!) {
        // B inserted before A, shift A's position
        transformedOp.position = opA.position! + (opB.text?.length || 0);
      }
      // If B inserted after A, no change needed
    }

    // Insert vs Delete
    else if (opA.type === 'insert' && opB.type === 'delete') {
      if (opB.position! < opA.position!) {
        // B deleted before A, shift A's position back
        transformedOp.position = Math.max(
          opB.position!,
          opA.position! - opB.length!
        );
      }
      // If B deleted after A, no change needed
    }

    // Delete vs Insert
    else if (opA.type === 'delete' && opB.type === 'insert') {
      if (opB.position! <= opA.position!) {
        // B inserted before A, shift A's position forward
        transformedOp.position = opA.position! + (opB.text?.length || 0);
      }
      // If B inserted after A, no change needed
    }

    // Delete vs Delete
    else if (opA.type === 'delete' && opB.type === 'delete') {
      if (opB.position! < opA.position!) {
        // B deleted before A, shift A's position back
        transformedOp.position = Math.max(
          opB.position!,
          opA.position! - opB.length!
        );
      } else if (opB.position! === opA.position!) {
        // Same position - operations overlap
        if (opB.length! >= opA.length!) {
          // B deleted everything A wanted to delete
          transformedOp.length = 0; // A becomes no-op
        } else {
          // A still has some deletion to do
          transformedOp.length = opA.length! - opB.length!;
        }
      }
    }

    return transformedOp;
  }

  /**
   * Transform an operation against a list of concurrent operations
   */
  static transformAgainstList(
    operation: Operation,
    operations: Operation[]
  ): Operation {
    let transformed = operation;

    for (const op of operations) {
      if (op.version === operation.version && op.timestamp < operation.timestamp) {
        transformed = this.transform(transformed, op);
      }
    }

    return transformed;
  }

  /**
   * Apply an operation to text content
   */
  static applyOperation(content: string, operation: Operation): string {
    if (operation.type === 'insert' && operation.text) {
      const before = content.substring(0, operation.position);
      const after = content.substring(operation.position!);
      return before + operation.text + after;
    }

    if (operation.type === 'delete' && operation.length) {
      const before = content.substring(0, operation.position);
      const after = content.substring(operation.position! + operation.length);
      return before + after;
    }

    return content;
  }

  /**
   * Compose two sequential operations into one
   */
  static compose(opA: Operation, opB: Operation): Operation | null {
    // Can only compose operations from the same user
    if (opA.userId !== opB.userId) {
      return null;
    }

    // Insert + Insert at adjacent positions
    if (
      opA.type === 'insert' &&
      opB.type === 'insert' &&
      opA.position! + (opA.text?.length || 0) === opB.position
    ) {
      return {
        type: 'insert',
        position: opA.position,
        text: (opA.text || '') + (opB.text || ''),
        userId: opA.userId,
        timestamp: opB.timestamp,
        version: opB.version,
      };
    }

    // Delete + Delete at same position
    if (
      opA.type === 'delete' &&
      opB.type === 'delete' &&
      opA.position === opB.position
    ) {
      return {
        type: 'delete',
        position: opA.position,
        length: (opA.length || 0) + (opB.length || 0),
        userId: opA.userId,
        timestamp: opB.timestamp,
        version: opB.version,
      };
    }

    return null;
  }

  /**
   * Validate an operation
   */
  static isValid(operation: Operation, contentLength: number): boolean {
    if (!operation.userId || !operation.timestamp || operation.version === undefined) {
      return false;
    }

    if (operation.type === 'insert') {
      return (
        operation.position !== undefined &&
        operation.position >= 0 &&
        operation.position <= contentLength &&
        operation.text !== undefined &&
        operation.text.length > 0
      );
    }

    if (operation.type === 'delete') {
      return (
        operation.position !== undefined &&
        operation.position >= 0 &&
        operation.position < contentLength &&
        operation.length !== undefined &&
        operation.length > 0 &&
        operation.position + operation.length <= contentLength
      );
    }

    return false;
  }
}

/**
 * Document state manager for OT
 */
export class DocumentState {
  private content: string;
  private version: number;
  private operations: Operation[];
  private maxOperations: number = 100;

  constructor(initialContent: string = '', initialVersion: number = 0) {
    this.content = initialContent;
    this.version = initialVersion;
    this.operations = [];
  }

  /**
   * Apply an operation and update state
   */
  applyOperation(operation: Operation): boolean {
    // Validate operation
    if (!OperationalTransform.isValid(operation, this.content.length)) {
      return false;
    }

    // Transform against concurrent operations
    const transformed = OperationalTransform.transformAgainstList(
      operation,
      this.operations
    );

    // Apply the transformed operation
    this.content = OperationalTransform.applyOperation(this.content, transformed);
    this.version++;
    transformed.version = this.version;

    // Store operation
    this.operations.push(transformed);

    // Limit operation history
    if (this.operations.length > this.maxOperations) {
      this.operations = this.operations.slice(-this.maxOperations);
    }

    return true;
  }

  /**
   * Get current content
   */
  getContent(): string {
    return this.content;
  }

  /**
   * Get current version
   */
  getVersion(): number {
    return this.version;
  }

  /**
   * Get operation history
   */
  getOperations(): Operation[] {
    return [...this.operations];
  }

  /**
   * Get operations since a specific version
   */
  getOperationsSince(version: number): Operation[] {
    return this.operations.filter(op => op.version > version);
  }
}

export default OperationalTransform;
