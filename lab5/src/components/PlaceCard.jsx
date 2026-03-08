import React from 'react';

const PlaceCard = ({ place, onAdd }) => {
  const isPremium = place.rating === 5;
  const stars = "★".repeat(place.rating) + "☆".repeat(5 - place.rating);

  return (
    <article 
      className={`place-card ${isPremium ? 'premium-border' : ''}`}
      style={isPremium ? { boxShadow: "0 8px 25px rgba(255, 99, 71, 0.2)" } : { opacity: 0.9 }}
    >
      <div className="place-img-container">
        <img src={place.img} alt={place.name} />
      </div>
      <div className="place-content">
        <h3>
          {place.name}, {place.country}
          {isPremium && <span style={{ color: "#ff6347", fontSize: "0.8rem" }}> [PREMIUM]</span>}
        </h3>
        <p className="description">{place.desc}</p>
        <div className="place-footer">
          <div className="place-price">
            <span className="price" style={{ color: isPremium ? "#ff6347" : "#33c108" }}>
              від {place.price}€
            </span>
            <span className="rating">{stars}</span>
          </div>
          <button className="select-btn" onClick={() => onAdd(place)}>
            Додати до моїх подорожей
          </button>
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;