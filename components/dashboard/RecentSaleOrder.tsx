import { formatDate } from "@/lib/formateDate";

export default function RecentInventory({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-center">Customer</th>
          
          </tr>
        </thead>
        <tbody>
          {data?.slice(0, 5).map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2"> {formatDate(item.date)}</td>
              <td className="p-2 text-center">{item.customer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}