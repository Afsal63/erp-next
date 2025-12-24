import { Suspense } from "react";
import InventoryItemsClient from "./InventoryItemsClient";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <InventoryItemsClient />
    </Suspense>
  );
}

function PageLoader() {
  return (
    <div className="p-6 text-gray-500">
      Loading inventory items...
    </div>
  );
}