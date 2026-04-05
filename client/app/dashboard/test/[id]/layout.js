async function getTestName(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/v1/tests/${id}`,
      { next: { revalidate: 60 } }
    );
    if (response.ok) {
      const test = await response.json();
      return test.name || test.title;
    }
  } catch (error) {
    console.error('Failed to fetch test:', error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const testName = await getTestName(id);
  const title = testName ? `${testName} | Evalio - Online Exam` : "Take Test | Evalio - Online Exam";
  const description = testName ? `Take the ${testName} exam on Evalio - answer questions, track time, and receive instant results with detailed performance analysis.` : "Take your online exam on Evalio - answer questions, track time, and receive instant results with detailed performance analysis.";

  return {
    title,
    description,
  };
}

export default function TestSessionLayout({ children }) {
  return children;
}
