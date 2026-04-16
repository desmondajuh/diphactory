export function FocusBrackets() {
  const SIZE = 38;
  const corners = [
    { cls: "top-3.5 left-3.5", points: `${SIZE / 2},4 4,4 4,${SIZE / 2}` },
    {
      cls: "top-3.5 right-3.5",
      points: `${SIZE / 2},4 ${SIZE - 4},4 ${SIZE - 4},${SIZE / 2}`,
    },
    {
      cls: "bottom-3.5 left-3.5",
      points: `4,${SIZE / 2} 4,${SIZE - 4} ${SIZE / 2},${SIZE - 4}`,
    },
    {
      cls: "bottom-3.5 right-3.5",
      points: `${SIZE - 4},${SIZE / 2} ${SIZE - 4},${SIZE - 4} ${SIZE / 2},${SIZE - 4}`,
    },
  ];
  return (
    <>
      {corners.map(({ cls, points }, i) => (
        <div
          key={i}
          className={`absolute ${cls} pointer-events-none`}
          style={{ width: SIZE, height: SIZE }}
        >
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            fill="none"
            className="w-full h-full"
          >
            <polyline
              points={points}
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
