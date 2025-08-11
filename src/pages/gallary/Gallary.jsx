import React from 'react';

const GalleryPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(to right, #1f2937, #374151)', 
        color: 'white', 
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          margin: '0',
          fontFamily: 'Arial, sans-serif',
          color: 'white'
        }}>
          GALLERY
        </h1>
        <div style={{
          width: '100px',
          height: '4px',
          backgroundColor: '#3b82f6',
          margin: '1rem auto',
          borderRadius: '2px'
        }}></div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '3rem 1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Image 1 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease'
          }}>
            <img 
              src="https://dummyimage.com/400x400/3b82f6/ffffff&text=Team+Meeting"
              alt="Team Meeting"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Team Meeting 2024
              </h3>
            </div>
          </div>

          {/* Image 2 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/10b981/ffffff&text=Office+Space"
              alt="Office Space"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Modern Office Space
              </h3>
            </div>
          </div>

          {/* Image 3 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/8b5cf6/ffffff&text=Conference"
              alt="Conference"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Annual Conference
              </h3>
            </div>
          </div>

          {/* Image 4 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/f59e0b/ffffff&text=Collaboration"
              alt="Collaboration"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Team Collaboration
              </h3>
            </div>
          </div>

          {/* Image 5 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/ef4444/ffffff&text=Presentation"
              alt="Presentation"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Quarterly Presentation
              </h3>
            </div>
          </div>

          {/* Image 6 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/06b6d4/ffffff&text=Workshop"
              alt="Workshop"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Training Workshop
              </h3>
            </div>
          </div>

          {/* Image 7 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/84cc16/ffffff&text=Celebration"
              alt="Celebration"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Office Celebration
              </h3>
            </div>
          </div>

          {/* Image 8 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/f97316/ffffff&text=Planning"
              alt="Planning"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Strategic Planning
              </h3>
            </div>
          </div>

          {/* Image 9 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <img 
              src="https://dummyimage.com/400x400/ec4899/ffffff&text=Team+Building"
              alt="Team Building"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1f2937' }}>
                Team Building Event
              </h3>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GalleryPage;
