// WebRTC configuration
export const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

// Media constraints
export const mediaConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

// Get user media stream
export async function getUserMedia(
  videoEnabled: boolean = true,
  audioEnabled: boolean = true
): Promise<MediaStream> {
  try {
    const constraints: MediaStreamConstraints = {
      video: videoEnabled ? mediaConstraints.video : false,
      audio: audioEnabled ? mediaConstraints.audio : false,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}

// Get screen share stream
export async function getScreenShare(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
      },
      audio: false,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing screen share:', error);
    throw error;
  }
}

// Get available devices
export async function getDevices(): Promise<{
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
}> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    return {
      cameras: devices.filter((device) => device.kind === 'videoinput'),
      microphones: devices.filter((device) => device.kind === 'audioinput'),
      speakers: devices.filter((device) => device.kind === 'audiooutput'),
    };
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return { cameras: [], microphones: [], speakers: [] };
  }
}

// Stop all tracks in a stream
export function stopMediaStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

// Toggle track enabled state
export function toggleTrack(
  stream: MediaStream | null,
  kind: 'audio' | 'video',
  enabled: boolean
) {
  if (!stream) return;
  
  const tracks = stream.getTracks().filter((track) => track.kind === kind);
  tracks.forEach((track) => {
    track.enabled = enabled;
  });
}
