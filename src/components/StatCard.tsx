import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: ReactNode;
  descriptionClassName?: string;
};

export default function StatCard({
  title,
  value,
  description,
  icon,
  descriptionClassName = "text-green-500",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div>{icon}</div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-700">
            {title}
          </p>

          <h2 className="mt-1 text-[21px] font-bold leading-tight text-black">
            {value}
          </h2>

          {description && (
            <p
              className={`mt-2 text-[10px] font-medium ${descriptionClassName}`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}