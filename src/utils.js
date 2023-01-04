// Graph dimensions and margins
export const width = 850;
export const height = 850;
export const margin = { top: 40, bottom: 100, left: 50, right: 40 };
export const background = '#eaedff';

// Bounds
export const xMax = width - margin.left - margin.right;
export const yMax = height - margin.top - margin.bottom;

// Some helpers
export const x = (d) => d.letter;
export const y = (d) => +d.frequency * 100;

// Header and Footer
export const NavBar = () => {
  return (
    <header>
      <p>Goosfraba GraphQL Test</p>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer>
      <p>GraphQL Test</p>
    </footer>
  );
};
