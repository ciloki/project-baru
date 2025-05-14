import { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, Copy, Share2, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useState } from "react";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/:id");
  const [copied, setCopied] = useState(false);
  
  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${params?.id}`],
    enabled: !!params?.id,
  });

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  if (!match) {
    setLocation("/not-found");
    return null;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Blog Post',
        text: post?.content || 'Check out this crypto blog post!',
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Blog Post</h1>
          <p className="text-gray-300 mb-6">Failed to load the blog post. Please try again later.</p>
          <Link href="/blog">
            <Button variant="outline" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-dark">
      {post && (
        <Helmet>
          <title>{`${post.title} - Airdrops Hunter Blog`}</title>
          <meta name="description" content={post.content.substring(0, 160)} />
          <meta property="og:title" content={`${post.title} - Airdrops Hunter Blog`} />
          <meta property="og:description" content={post.content.substring(0, 160)} />
          <meta property="og:image" content={post.imageUrl} />
          <meta property="og:type" content="article" />
          <meta name="keywords" content={post.tags?.split(',').join(', ') || 'crypto, airdrop, blockchain'} />
        </Helmet>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline" size="sm" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="w-full h-64 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : post ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-lighter rounded-xl shadow-xl overflow-hidden"
          >
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6 md:p-8">
              <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
                
                <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{post.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{post.content}</p>
              </div>
              
              {post.tags && (
                <div className="mt-8 pt-4 border-t border-gray-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-400">Tags:</span>
                    {post.tags.split(',').map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-dark px-2 py-1 rounded-md text-xs text-gray-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex gap-3">
                <Button 
                  className="bg-primary hover:bg-primary-dark"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <><Check className="mr-2 h-4 w-4" /> Copied</>
                  ) : (
                    <><Copy className="mr-2 h-4 w-4" /> Copy Link</>
                  )}
                </Button>
              </div>
            </div>
          </motion.article>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Blog Post Not Found</h1>
              <p className="text-gray-300 mb-6">The blog post you're looking for does not exist or has been removed.</p>
              <Link href="/blog">
                <Button variant="outline" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
