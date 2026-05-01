import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const AppLayout = lazy(() => import('@/layouts/AppLayout'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/chat" replace /> },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: 'chat/:sessionId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: 'documents',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DocumentsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
