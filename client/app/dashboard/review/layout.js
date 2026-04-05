async function getSessionTestName(sessionId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/v1/sessions/${sessionId}`,
      { next: { revalidate: 60 } }
    );
    if (response.ok) {
      const session = await response.json();
      return session.test?.name || session.testName;
    }
  } catch (error) {
    console.error('Failed to fetch session:', error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  const testName = await getSessionTestName(sessionId);
  const title = testName ? `Review: ${testName} | Evalio Dashboard` : "Review Test | Evalio Dashboard";
  const description = testName ? `Review your ${testName} exam responses, correct answers, and detailed explanations on Evalio - learn from your test performance.` : "Review your exam responses, correct answers, and detailed explanations - learn from your test performance on Evalio.";

  return {
    title,
    description,
  };
}

export default function ReviewLayout({ children }) {
  return children;
}
