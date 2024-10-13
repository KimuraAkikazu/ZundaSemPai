import React, { useRef, useState } from 'react';

const ScreenShotButton: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Video要素への参照
  const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas要素への参照
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null); // 画像データの状態

  // 画面キャプチャを開始する関数
  const startCapture = async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as any,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = captureStream;
        setIsCapturing(true);
        setTimeout(() => {
          takeScreenshot(captureStream); // captureStreamを直接渡す
        }, 100); //なるべく最短で
      }
    } catch (err) {
      console.error('Error starting capture:', err);
    }
  };

  // スクリーンショットを撮る関数
  const takeScreenshot = (captureStream: MediaStream) => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // CanvasにVideoのフレームを描画
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Base64形式の画像データを取得
        const image = canvas.toDataURL('image/png');
        setImageData(image); // 画像データを状態に保存
      }

      // スクリーンショットを撮った後、画面共有を終了
      const tracks = captureStream.getTracks();
      tracks.forEach((track) => track.stop()); // すべてのトラックを停止
      setIsCapturing(false); // キャプチャ状態を終了
      console.log('Screen capture ended.');
    }
  };

  // 画像をダウンロードする関数
  const downloadImage = () => {
    if (imageData) {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'screenshot.png';
      link.click();
    }
  };

  return (
    <div>
      <h1>Screen Capture Example</h1>
      {isCapturing && <p>画面キャプチャ中...</p>}
      <button onClick={startCapture} disabled={isCapturing}>
        画面をキャプチャ
      </button>
      <button onClick={() => takeScreenshot} disabled={!isCapturing}>
        スクリーンショットを撮る
      </button>
      <button onClick={downloadImage} disabled={!imageData}>
        スクリーンショットをダウンロード
      </button>

      <div style={{ display: 'none' }}>
        <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
        <canvas ref={canvasRef} width={800} height={600}></canvas>
      </div>

      {imageData && (
        <div>
          <h3>スクリーンショット:</h3>
          <img src={imageData} alt="Screenshot" />
        </div>
      )}
    </div>
  );
};

export default ScreenShotButton;
