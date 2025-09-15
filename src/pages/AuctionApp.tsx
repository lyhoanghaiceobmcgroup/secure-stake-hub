import React, { useState } from 'react';
import { TrendingUp, Bell, User, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import AuctionListing from '../components/investor/AuctionListing';
import AuctionDetail from '../components/investor/AuctionDetail';
import DetailedAuctionView from '../components/investor/DetailedAuctionView';
import { AuctionRound, BidOrder } from '../types/auction';
import { auctionService } from '../services/auctionService';
import { getDetailedAuctionByRoundIdLocal } from '../data/auctionMockData';
import { getAllDetailedAuctionData } from '../data/detailedAuctionMockData';

const AuctionApp: React.FC = () => {
  const [selectedRound, setSelectedRound] = useState<AuctionRound | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'detailed'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  const handleSelectRound = (round: AuctionRound) => {
    setSelectedRound(round);
    // Check if this round has detailed data available
    const detailedData = getDetailedAuctionByRoundIdLocal(round.id);
    setViewMode(detailedData ? 'detailed' : 'detail');
    setSidebarOpen(false);
  };

  const handleBackToListing = () => {
    setSelectedRound(null);
    setViewMode('list');
  };

  const handleBidPlaced = (bid: BidOrder) => {
    console.log('Bid placed:', bid);
    // Handle bid placement (e.g., show success message, update UI)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">GoldenBook</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Đấu giá quyền lợi phân phối</p>
                </div>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/investor" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </a>
              <a href="/investor/opportunities" className="text-gray-600 hover:text-gray-900 transition-colors">
                Cơ hội đầu tư
              </a>
              <a href="/investor/auction" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Đấu giá
              </a>
              <a href="/investor/portfolio" className="text-gray-600 hover:text-gray-900 transition-colors">
                Danh mục
              </a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Tài khoản</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-30 md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 space-y-2">
          <a 
            href="/investor" 
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </a>
          <a 
            href="/investor/opportunities" 
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Cơ hội đầu tư
          </a>
          <a 
            href="/investor/auction" 
            className="block px-3 py-2 rounded-md text-blue-600 bg-blue-50 font-medium"
            onClick={() => setSidebarOpen(false)}
          >
            Đấu giá
          </a>
          <a 
            href="/investor/portfolio" 
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Danh mục
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'list' ? (
          <AuctionListing onSelectRound={handleSelectRound} />
        ) : viewMode === 'detailed' && selectedRound ? (
          (() => {
            const detailedData = getDetailedAuctionByRoundId(selectedRound.id);
            return detailedData ? (
              <DetailedAuctionView 
                auctionData={detailedData}
                onBack={handleBackToListing}
              />
            ) : (
              <AuctionDetail
                round={selectedRound}
                onBack={handleBackToListing}
                onBidPlaced={handleBidPlaced}
              />
            );
          })()
        ) : selectedRound ? (
          <AuctionDetail
            round={selectedRound}
            onBack={handleBackToListing}
            onBidPlaced={handleBidPlaced}
          />
        ) : (
          <AuctionListing onSelectRound={handleSelectRound} />
        )}
      </main>

      {/* Quick Stats Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Vòng đang mở</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">₫2.4T</div>
              <div className="text-sm text-gray-600">Tổng huy động</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">8.2%</div>
              <div className="text-sm text-gray-600">R_clear trung bình</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">1,247</div>
              <div className="text-sm text-gray-600">Nhà đầu tư tham gia</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button 
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => {
            // Scroll to top or show quick actions
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <TrendingUp className="w-6 h-6" />
        </Button>
      </div>

      {/* Real-time Status Indicator */}
      <div className="fixed bottom-6 left-6 hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-lg border">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600">Realtime</span>
      </div>
    </div>
  );
};

export default AuctionApp;