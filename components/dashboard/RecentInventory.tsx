export default function RecentInventory({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-center">Qty</th>
            <th className="p-2 text-center">Price</th>
            <th className="p-2 text-center">Unit</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item.itemName}</td>
              <td className="p-2 text-center">{item.quantity}</td>
              <td className="p-2 text-center">₹{item.normalDiscountedPrice}</td>
              <td className="p-2 text-center">{item.unitOfMeasures}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}