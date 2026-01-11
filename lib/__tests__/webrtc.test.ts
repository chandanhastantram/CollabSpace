import { getUserMedia, stopMediaStream, toggleTrack } from '../webrtc';

describe('WebRTC utilities', () => {
  describe('getUserMedia', () => {
    it('should request media with correct constraints', async () => {
      const mockGetUserMedia = jest.fn().mockResolvedValue({
        getTracks: () => [],
      });
      
      global.navigator.mediaDevices = {
        getUserMedia: mockGetUserMedia,
      } as any;

      await getUserMedia(true, true);

      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: expect.objectContaining({
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }),
        audio: expect.objectContaining({
          echoCancellation: true,
          noiseSuppression: true,
        }),
      });
    });

    it('should handle video-only request', async () => {
      const mockGetUserMedia = jest.fn().mockResolvedValue({
        getTracks: () => [],
      });
      
      global.navigator.mediaDevices = {
        getUserMedia: mockGetUserMedia,
      } as any;

      await getUserMedia(true, false);

      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: expect.any(Object),
        audio: false,
      });
    });
  });

  describe('stopMediaStream', () => {
    it('should stop all tracks in a stream', () => {
      const mockTrack1 = { stop: jest.fn() };
      const mockTrack2 = { stop: jest.fn() };
      const mockStream = {
        getTracks: () => [mockTrack1, mockTrack2],
      } as any;

      stopMediaStream(mockStream);

      expect(mockTrack1.stop).toHaveBeenCalled();
      expect(mockTrack2.stop).toHaveBeenCalled();
    });

    it('should handle null stream', () => {
      expect(() => stopMediaStream(null)).not.toThrow();
    });
  });

  describe('toggleTrack', () => {
    it('should toggle audio track', () => {
      const mockAudioTrack = { kind: 'audio', enabled: true };
      const mockVideoTrack = { kind: 'video', enabled: true };
      const mockStream = {
        getTracks: () => [mockAudioTrack, mockVideoTrack],
      } as any;

      toggleTrack(mockStream, 'audio', false);

      expect(mockAudioTrack.enabled).toBe(false);
      expect(mockVideoTrack.enabled).toBe(true);
    });
  });
});
