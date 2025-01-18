import { useState, useEffect , useRef} from 'react';

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/image/H_roti.jpg',
    '/image/H_roti2.jpg',
    '/image/H_cakes.jpg',     
    '/image/H_roti1.jpg',
    '/image/H_roti3.jpg',

  ];

  const descriptionRef = useRef([]);

  const handleScroll = () => {
    descriptionRef.current.forEach((desc) => {
      const rect = desc.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        desc.classList.add('visible');
      } else {
        desc.classList.remove('visible');
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Slide every 5 seconds

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);  

  return (
    <div className="home-page">
      {/* Carousel Container */}
      <div className="carousel-container">
        <div
          className="carousel"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-item">
              <img src={image} alt={`Bakery Product ${index + 1}`} />
              <div className="carousel-caption">
                <h2 style={{ color: '#67E6DA', fontWeight: 'bold', fontSize: '85px', fontFamily: 'Caveat, cursive' }}>
                  Our Recommendation
                </h2>
                <p style={{ color: '#B0FFF8', fontWeight: 'bold', fontFamily: 'Caveat, cursive', fontSize: '35px' }}>
                  Delicious and freshly baked goods, just for you!
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>  

      {/* Bakery Description Section */}
      <section className="bakery-description">
        <h3 style={{textAlign:'center' , fontSize:'70px', fontWeight: 'bold', fontFamily: 'Caveat, cursive'}}>Welcome to Our Bakery!</h3>
        <p style={{textAlign:'center' , fontSize:'20px', fontWeight: 'bold', fontFamily: 'Caveat, cursive', padding :'15px'}}>
          At Our Bakery, we offer a variety of mouth-watering and freshly baked goods. From our signature cheesy jumbo bread to our delectable mulberry cream cheese buns, every item is crafted with love and care.</p>
          <p style={{textAlign:'center' , fontSize:'30px', fontWeight: 'bold', fontFamily: 'Caveat, cursive', padding :'15px', color:'#FF2F00'}}>
            Here is the reason choosing our shop!
          </p>
        <div className="description-images">  
          {/* First Item - Image on left, text on right */}
          <div className="description-item">
            <img src="/image/H_fresh.jpg" alt="Loading" className="description-image" />
            <div ref={(el) => descriptionRef.current.push(el)} className="item-description">
              <h4>Fresh</h4>
              <p>We bake everything fresh every day to ensure that you receive the most delicious and mouthwatering delicacies.</p>
            </div>
          </div>
          
          {/* Second Item - Image on right, text on left */}
          <div className="description-item-reverse">
            <img src="/image/H_ingre.jpg" alt="Loading" className="description-image" />
            <div ref={(el) => descriptionRef.current.push(el)} className="item-description">
              <h4>Ingredients</h4>
              <p>Our products are manufactured in the most hygienic and highest quality</p>
            </div>
          </div>

          <div className="description-item">
            <img src="/image/H_roti4.webp" alt="Loading" className="description-image" />
            <div ref={(el) => descriptionRef.current.push(el)} className="item-description">
              <h4>Cheap</h4>
              <p>No one needs to worry about hunger</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;
