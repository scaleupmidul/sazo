// App.tsx

// ... (imports remain same)

const App: React.FC = () => {
  // ... (hooks and logic remain same)

  const renderPage = () => {
    if (path === '/admin/login') {
      return (
        <Suspense fallback={<PageLoader />}>
            <AdminLoginPage />
        </Suspense>
      );
    }

    if (path.startsWith('/admin')) {
      return (
          <Suspense fallback={<PageLoader />}>
            <AdminLayout>
                {renderAdminPageContent()}
            </AdminLayout>
          </Suspense>
      );
    }
    
    // CUSTOMER PAGES - Wrapped in Suspense for Lazy Loading
    return (
        // Updated fallback container to ensure full screen centering for initial load
        <Suspense fallback={<PageLoader />}>
            {(() => {
                const productMatch = path.match(/^\/product\/(.+)$/);
                if (productMatch) {
                  return <ProductDetailsPage />;
                }

                const thankYouMatch = path.match(/^\/thank-you\/(.+)$/);
                if (thankYouMatch) {
                    const orderId = thankYouMatch[1];
                    return <ThankYouPage orderId={orderId} />;
                }

                switch (path) {
                  case '/':
                    return <HomePage />;
                  case '/shop':
                    return <ShopPage />;
                  case '/cart':
                    return <CartPage />;
                  case '/checkout':
                    return <CheckoutPage />;
                  case '/contact':
                    return <ContactPage />;
                  case '/policy':
                    return <PolicyPage />;
                  default:
                    return <HomePage />;
                }
            })()}
        </Suspense>
    );
  };

  return (
    <div className={`min-h-screen ${isCustomerPage ? 'bg-[#FEF5F5]' : 'bg-gray-100'} font-sans flex flex-col`}>
      {/* ... styles remain same ... */}

      <Notification notification={notification} />
      {isCustomerPage && <Header />}
      <div className="flex-grow flex flex-col relative">
          {renderPage()}
      </div>
      {isCustomerPage && showWhatsAppButton && <WhatsAppButton />}
      {isCustomerPage && <Footer />}
    </div>
  );
};

export default App;
