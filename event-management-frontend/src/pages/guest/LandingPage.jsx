import React from "react";
import Hero from "../../components/common/Hero";
import StatCard from "../../components/dashboard/StatCard";
import BrowseCategories from "../../components/common/BrowseCategories";
import EventCard from "../../components/event/EventCard";
import HostBanner from "../../components/common/HostBanner";
import Testimonials from "../../components/common/Testimonials";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearchSubmit,
  featuredEvents,
  upcomingEvents,
  onBookClick,
  onViewAllEvents,
  onCategorySelect,
  onResetFilters,
  onNavigateToRegister,
}) {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onSearchSubmit={onSearchSubmit}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
      >
        <StatCard />
      </motion.div>

      <main className="container" id="featured" style={{ minHeight: "20rem" }}>
        {activeCategory !== "all" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Filtering by:
            </span>
            <span
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {activeCategory.toUpperCase()}
              <X
                size={14}
                style={{ cursor: "pointer" }}
                onClick={onResetFilters}
              />
            </span>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="section-header"
        >
          <div className="section-title-area">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">
              Hand-picked experiences you won't want to miss
            </p>
          </div>
          <span
            style={{ cursor: "pointer" }}
            onClick={onViewAllEvents}
            className="section-link"
          >
            <span>View all</span>
            <span>&rarr;</span>
          </span>
        </motion.div>

        {featuredEvents.length > 0 ? (
          <motion.div 
            className="cards-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {featuredEvents.map((evt) => (
              <motion.div key={evt.id} variants={itemFade}>
                <EventCard event={evt} onBookClick={onBookClick} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "3rem 0",
            }}
          >
            No featured events match the active filters.
          </p>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <BrowseCategories
            activeCategory={activeCategory}
            setActiveCategory={onCategorySelect}
            categories={categories}
          />
        </motion.div>

        <motion.div 
          className="section-header" 
          style={{ marginTop: "4rem" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="section-title-area">
            <h2 className="section-title">Upcoming This Month</h2>
            <p className="section-subtitle">
              Trending events in your neighborhood
            </p>
          </div>
          <span
            style={{ cursor: "pointer" }}
            onClick={onViewAllEvents}
            className="section-link"
          >
            <span>See more</span>
            <span>&rsaquo;</span>
          </span>
        </motion.div>

        {upcomingEvents.length > 0 ? (
          <motion.div 
            className="cards-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {upcomingEvents.map((evt) => (
              <motion.div key={evt.id} variants={itemFade}>
                <EventCard event={evt} onBookClick={onBookClick} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "3rem 0",
            }}
          >
            No upcoming events match the active filters.
          </p>
        )}

        <motion.div
          id="host"
          style={{ paddingTop: "2rem" }}
          onClick={onNavigateToRegister}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <HostBanner />
        </motion.div>

        {/* <Testimonials testimonials={testimonials} /> */}
      </main>
    </>
  );
}
