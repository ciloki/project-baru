import { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowLeft, Copy, ExternalLink, Check, Share2 } from "lucide-react";
import { getStatusColor, formatDate, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import type { Airdrop } from "@shared/schema";

export default function AirdropDetails() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/airdrops/:id");
  const [copied, setCopied] = useState(false);
  
  const { data: airdrop, isLoading, isError } = useQuery<Airdrop>({
    queryKey: [`/api/airdrops/${params?.id}`],
    enabled: !!params?.id,
  });

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Add animation effect for scrolling
    const animateElements = () => {
      document.querySelectorAll('.animate-on-scroll').forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.9) {
          element.classList.add('is-visible');
        }
      });
    };

    animateElements();
    window.addEventListener('scroll', animateElements);
    
    return () => {
      window.removeEventListener('scroll', animateElements);
    };
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
        title: airdrop?.title || 'Airdrop Details',
        text: airdrop?.description || 'Check out this crypto airdrop!',
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
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Airdrop</h1>
          <p className="text-gray-300 mb-6">Failed to load the airdrop details. Please try again later.</p>
          <Link href="/airdrops">
            <Button variant="outline" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Airdrops
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-dark">
      {airdrop && (
        <Helmet>
          <title>{`${airdrop.title} - Airdrops Hunter`}</title>
          <meta name="description" content={airdrop.description} />
          <meta property="og:title" content={`${airdrop.title} - Airdrops Hunter`} />
          <meta property="og:description" content={airdrop.description} />
          <meta property="og:image" content={airdrop.coverImageUrl} />
          <meta property="og:type" content="website" />
          <meta name="keywords" content={`crypto airdrop, ${airdrop.projectName}, ${airdrop.category}, free tokens`} />
        </Helmet>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/airdrops">
            <Button variant="outline" size="sm" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Airdrops
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="rounded-lg h-64 md:w-1/3" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        ) : airdrop ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Image and Info */}
              <div className="md:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-dark-lighter rounded-lg overflow-hidden shadow-xl"
                >
                  <img 
                    src={airdrop.coverImageUrl} 
                    alt={airdrop.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={airdrop.logoUrl} 
                        alt={`${airdrop.projectName} Logo`} 
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h1 className="text-2xl font-bold text-white">{airdrop.projectName}</h1>
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(airdrop.status)}`}>
                          {airdrop.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 border-t border-gray-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white font-medium">{airdrop.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Value:</span>
                        <span className="text-secondary font-medium">{airdrop.estimatedValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-white font-medium">{formatNumber(airdrop.participants)}</span>
                      </div>
                      {airdrop.startDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Start Date:</span>
                          <span className="text-white font-medium">{formatDate(airdrop.startDate)}</span>
                        </div>
                      )}
                      {airdrop.endDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">End Date:</span>
                          <span className="text-white font-medium">{formatDate(airdrop.endDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary-dark"
                        onClick={handleShare}
                      >
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
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
                </motion.div>
              </div>
              
              {/* Right Column - Details */}
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-dark-lighter rounded-lg shadow-xl p-6"
                >
                  <h2 className="text-3xl font-bold text-white mb-2">{airdrop.title}</h2>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-sm">
                        {airdrop.startDate ? formatDate(airdrop.startDate) : 'Not specified'} 
                        {airdrop.endDate ? ` - ${formatDate(airdrop.endDate)}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-sm">{formatNumber(airdrop.participants)} participants</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                      <p className="text-gray-300 whitespace-pre-line">{airdrop.description}</p>
                    </div>
                    
                    {airdrop.requirements && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
                        <p className="text-gray-300 whitespace-pre-line">{airdrop.requirements}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">How to Participate</h3>
                      <ol className="list-decimal list-inside text-gray-300 space-y-2">
                        <li>Visit the official project website or social media channels.</li>
                        <li>Follow the instructions provided in the airdrop announcement.</li>
                        <li>Complete the required tasks (social media follows, community joins, etc.)</li>
                        <li>Submit your wallet address where specified.</li>
                        <li>Wait for the distribution to occur after the end date.</li>
                      </ol>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <Button className="bg-primary hover:bg-primary-dark">
                        <ExternalLink className="mr-2 h-4 w-4" /> Participate Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Airdrop Not Found</h1>
              <p className="text-gray-300 mb-6">The airdrop you're looking for does not exist or has been removed.</p>
              <Link href="/airdrops">
                <Button variant="outline" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Airdrops
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add useState as it's used but not imported
import { useState } from "react";
