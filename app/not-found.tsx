export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f8f8f8', background: 'transparent' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>404 – Not Found</h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.8 }}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
} 