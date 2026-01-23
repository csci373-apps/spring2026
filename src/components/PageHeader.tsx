import Link from "next/link";

interface PageHeaderProps {
  title: string;
  excerpt?: string;
  type?: string;
  group?: string;
  num?: string;
  includeExpandButton?: boolean
}

export default function PageHeader({ title, excerpt, type, group, num }: PageHeaderProps) {
  const className = '!border-transparent hover:border-b-2';
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {type && type === 'activity' ? (<><Link href="/" className={className}>Schedule</Link> &gt; </>) : ''}
        {type && ['homework', 'lab', 'assignment'].includes(type) ? (<><Link href="/assignments" className={className}>Assignments</Link> &gt; </>) : ''}
        {num ? (type === 'tutorial' ? `Tutorial ${num}: ` : `HW${num}: `) : ''}
        {group ? `${group}: ` : ''} {title}
      </h1>
      {excerpt && (
        <p className="text-gray-600 dark:text-gray-400 mt-2">{excerpt}</p>
      )}
    </div>
  );
}