import React, { useState } from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import bannerImg from '../assets/banners/news.png';

const News = () => {
  const categories = [
    "All News",
    "Latest school events",
    "Academic achievements",
    "Competition participation",
    "Holiday lessons",
    "Entrance examination announcements",
    "Graduation updates",
    "Educational seminars and workshops",
    "Community outreach activities"
  ];

  const [activeCategory, setActiveCategory] = useState("All News");

  // Mock data to make the page look populated
  const newsItems = [
    {
      title: "Annual Science Exhibition Highlights",
      category: "Latest school events",
      date: "May 15, 2026",
      excerpt: "Our students showcased incredible innovative projects, ranging from renewable energy models to robotics."
    },
    {
      title: "100% Pass Rate in Recent WAEC Exams",
      category: "Academic achievements",
      date: "May 10, 2026",
      excerpt: "We are proud to announce that our senior secondary students achieved outstanding results across all subjects."
    },
    {
      title: "National Debate Champions 2026",
      category: "Competition participation",
      date: "May 02, 2026",
      excerpt: "Peak Point debate team brings home the gold medal at the National Inter-School Debate Championship."
    },
    {
      title: "Summer Coding & Robotics Bootcamp",
      category: "Holiday lessons",
      date: "April 28, 2026",
      excerpt: "Registration is now open for our intensive 4-week summer program focusing on advanced digital skills."
    },
    {
      title: "Entrance Examination Dates for 2026/2027",
      category: "Entrance examination announcements",
      date: "April 20, 2026",
      excerpt: "The first batch of entrance examinations will hold on Saturday, June 13th. Apply online to secure a slot."
    },
    {
      title: "Class of 2026 Valedictory Service",
      category: "Graduation updates",
      date: "April 15, 2026",
      excerpt: "Join us in celebrating the graduating class as they prepare to transition to the next phase of their academic journey."
    }
  ];

  const filteredNews = activeCategory === "All News" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);

  return (
    <div className="news-page">
      <InnerBanner 
        title="News & Updates" 
        subtitle="Stay informed about the latest events, achievements, and announcements from our vibrant community."
        image={bannerImg}
      />

      <section className="section bg-bg-soft">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-12">
            
            {/* Sidebar / Categories */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 sticky top-32">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 border-b pb-4">
                  <Tag size={20} /> Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                          activeCategory === cat 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-text-muted hover:bg-secondary/20 hover:text-primary'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* News Feed */}
            <div className="md:col-span-3">
              <div className="flex-between mb-8 items-center">
                <h2 className="text-2xl font-bold">{activeCategory}</h2>
                <span className="text-sm text-text-muted font-medium bg-white px-4 py-1.5 rounded-full border shadow-sm">
                  Showing {filteredNews.length} articles
                </span>
              </div>

              {filteredNews.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border shadow-sm">
                  <p className="text-text-muted text-lg">No news items found for this category yet. Please check back later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredNews.map((news, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                      <div className="p-8 flex-1">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary mb-4 bg-secondary/10 w-fit px-3 py-1 rounded-full">
                          <Calendar size={14} /> {news.date}
                        </div>
                        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-text-muted leading-relaxed line-clamp-3">
                          {news.excerpt}
                        </p>
                      </div>
                      <div className="px-8 py-5 border-t bg-gray-50 flex-between">
                        <span className="text-xs font-bold text-text-muted truncate max-w-[150px]">{news.category}</span>
                        <button className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                          Read More <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
