'use client';

export default function ShrineHeader() {
  return (
    <div className="text-center mb-12 p-10 bg-dark-lighter/80 rounded-2xl backdrop-blur-md border-2 border-primary/30 shadow-lg shadow-primary/20">
      <h1 className="text-5xl text-primary mb-4 animate-glow">
        🏮 디버그 신사 🏮
      </h1>
      <p className="text-gray-400 text-sm mb-4">(デバッグ神社)</p>
      <p className="text-gray-200 text-lg mb-2">모든 버그를 물리치는 신성한 성지</p>
      <p className="text-gray-400">여기서 당신의 코드가 구원받을 것입니다</p>
    </div>
  );
} 