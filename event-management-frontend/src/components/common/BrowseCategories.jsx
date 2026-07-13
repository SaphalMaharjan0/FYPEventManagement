import React from "react";
import * as Icons from "lucide-react";

export default function BrowseCategories({ activeCategory, setActiveCategory, categories }) {
  // Dynamically resolve Lucide icons based on string representation
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent size={size} />;
    }
    return <Icons.HelpCircle size={size} />;
  };

  const handleCategoryClick = (categoryName) => {
    const lowerName = categoryName.toLowerCase();
    // Special mapping for label "Arts & Culture" or similar if we use "arts" in mock data
    const targetVal = lowerName.includes("art") ? "arts" : lowerName.includes("food") ? "food & drink" : lowerName.includes("health") ? "health & wellness" : lowerName;
    
    if (activeCategory === targetVal) {
      setActiveCategory("all");
    } else {
      setActiveCategory(targetVal);
    }
  };

  return (
    <section id="categories" className="category-section">
      <div className="container">
        <div className="section-header" style={{ justifyContent: "center", textAlign: "center", marginBottom: "3rem" }}>
          <div className="section-title-area">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find events that match your interests</p>
          </div>
        </div>

        <div className="category-grid">
          {categories.map((cat) => {
            const isSelected = 
              activeCategory === cat.name.toLowerCase() ||
              (cat.id === "arts" && activeCategory === "arts") ||
              (cat.id === "food" && activeCategory === "food & drink") ||
              (cat.id === "health" && activeCategory === "health & wellness");

            return (
              <div
                key={cat.id}
                className={`category-card ${isSelected ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="category-icon-wrapper">
                  {renderIcon(cat.icon)}
                </div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count} events</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
