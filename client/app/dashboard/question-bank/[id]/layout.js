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
  const title = subjectName ? `${subjectName} - Question Bank | Evalio Dashboard` : "Questions by Subject | Evalio Dashboard";
  const description = subjectName ? `Practice ${subjectName} questions on Evalio - strengthen your knowledge in ${subjectName} and track your topic-wise progress.` : "Practice questions organized by subject on Evalio - strengthen your knowledge, test your understanding, and track topic-wise progress.";

  return {
    title,
    description,
  };
}

export default function SubjectQuestionsLayout({ children }) {
  return children;
}
