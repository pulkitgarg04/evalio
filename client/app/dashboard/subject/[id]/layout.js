async function getSubjectName(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/v1/subjects`,
      { next: { revalidate: 300 } }
    );
    if (response.ok) {
      const subjects = await response.json();
      const subject = subjects.find(s => s._id === id);
      return subject?.name;
    }
  } catch (error) {
    console.error('Failed to fetch subject:', error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const subjectName = await getSubjectName(id);
  const title = subjectName ? `${subjectName} Tests | Evalio Dashboard` : "Subject Details | Evalio Dashboard";
  const description = subjectName ? `Explore ${subjectName} tests on Evalio - find and take subject-specific exams to enhance your learning in ${subjectName}.` : "View detailed information about exam subjects on Evalio - access subject-specific tests and practice questions.";

  return {
    title,
    description,
  };
}

export default function SubjectDetailsLayout({ children }) {
  return children;
}
