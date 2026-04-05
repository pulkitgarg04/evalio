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
  const title = testName ? `Edit: ${testName} | Evalio Admin` : "Edit Test | Evalio Admin";
  const description = testName ? `Edit ${testName} - modify test details, questions, and exam settings on Evalio admin panel.` : "Edit and manage your online exam settings on Evalio - update test details, modify questions, and adjust exam parameters.";

  return {
    title,
    description,
  };
}

export default function EditTestLayout({ children }) {
  return children;
}
