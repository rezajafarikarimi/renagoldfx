// Artwork is cropped from the user's supplied reference, not redrawn approximations.
const REGIONS = {
  hero: [232, 126, 1304, 313],
  logo: [80, 51, 99, 103],
  mark: [88, 52, 80, 64],
  phone: [240, 602, 189, 203],
  markets: [1030, 616, 284, 188],
  mountains: [230, 925, 1080, 40],
};

export default function ReferenceArt({ region, className = '', label }) {
  const crop = REGIONS[region];
  return (
    <svg
      viewBox={crop.join(' ')}
      preserveAspectRatio={region === 'mountains' ? 'none' : 'xMidYMid slice'}
      overflow="hidden"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <image href="/images/reference.jpg" width="1536" height="1024" />
    </svg>
  );
}
