import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useData } from "@/context/DataContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, User } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllBlogPosts() {
  const { blogPosts, isLoadingBlogPosts } = useData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // Get unique categories from blog posts
  const categories = blogPosts ? 
    ["All", ...new Set(blogPosts.map(post => post.category))] : 
    ["All", "Guide", "News", "Analysis", "Tutorial", "Strategy", "Security"];

  // Filter blog posts based on search and category
  useEffect(() => {
    if (!blogPosts) return;
    
    let filtered = [...blogPosts];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query) ||
          (post.tags && post.tags.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Sort by published date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    setFilteredPosts(filtered);
  }, [blogPosts, searchQuery, selectedCategory]);

  // Handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Animation variants
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
    <div className="pt-20 pb-16 bg-dark">
      <Helmet>
        <title>Crypto Blog - Airdrops Hunter</title>
        <meta name="description" content="Read the latest articles about cryptocurrency airdrops, blockchain technology, and strategies to maximize your earnings from free token distributions." />
        <meta property="og:title" content="Crypto Blog - Airdrops Hunter" />
        <meta property="og:description" content="Stay updated with the latest crypto news, guides, and strategies for finding and participating in the best airdrops." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="crypto blog, airdrop guides, blockchain news, crypto strategy, free tokens" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Crypto Blog</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest crypto trends, airdrop strategies, and educational content
            to help you navigate the world of cryptocurrency.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-dark-lighter border-gray-700 text-white"
            />
          </div>
          
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-dark-lighter border-gray-700 text-white">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-dark-lighter border-gray-700 text-white">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white"
          >
            Reset Filters
          </Button>
        </div>

        {/* Results Count */}
        {!isLoadingBlogPosts && (
          <p className="text-gray-400 mb-6">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          </p>
        )}

        {/* Blog Posts Grid */}
        {isLoadingBlogPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
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
        ) : filteredPosts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  layout
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
                    <p className="text-gray-300 mb-4 line-clamp-3">{truncateText(post.content, 120)}</p>
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
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
