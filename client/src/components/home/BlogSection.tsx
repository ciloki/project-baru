import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useData } from "@/context/DataContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, truncateText } from "@/lib/utils";

export default function BlogSection() {
  const { blogPosts, isLoadingBlogPosts } = useData();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  
  const titleSection = useScrollAnimation();

  useEffect(() => {
    if (blogPosts && blogPosts.length > 0) {
      setFeaturedPosts(blogPosts.slice(0, 3));
    }
  }, [blogPosts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="blog" className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleSection.ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={titleSection.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Latest Crypto News</h2>
          <p className="mt-4 text-lg text-gray-300">Stay updated with the latest crypto trends and airdrop strategies</p>
        </motion.div>
        
        {isLoadingBlogPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-dark-lighter rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="bg-dark-lighter rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-dark px-2 py-1 rounded text-xs text-white">{post.category}</span>
                    <span className="text-gray-400 text-sm">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                  <p className="text-gray-300 mb-4">{truncateText(post.content, 100)}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {post.authorId ? "A" : "AH"}
                      </div>
                      <span className="text-gray-400 text-sm ml-2">Admin</span>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <a className="text-primary hover:text-primary-light font-medium transition duration-150 ease-in-out">Read More</a>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/blog">
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition duration-150 ease-in-out">
              View All Articles
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
