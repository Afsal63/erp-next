"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import { BARCODE_OPTIONS } from "@/constants/barcodes";

const DEPARTMENTS = ["Sales","Production","Accounts","Packing","Marketing","Delivery"];
const POSITIONS = ["Production Head","Packing Head","Packing Staff","Quality Controller","Accountants Head","Billing Staff","Delivery Staff","Head Of Sales"];

type Props = {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  form: any;
  setForm: (fn: (prev: any) => any) => void;
  onBarcodeSelect: (barCode: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function EmployeeModal({
  open, mode, loading, form, setForm, onBarcodeSelect, onClose, onSave,
}: Props) {

  const [selectedBarcode, setSelectedBarcode] = useState("");

  const selectedBarcodes = useMemo(() => {
    const set = new Set<string>();
    (form.items || []).forEach((i: any) => set.add(i.barCode));
    return Array.from(set);
  }, [form.items]);

  const removeItem = (id: string) => {
    setForm((prev: any) => ({
      ...prev,
      items: prev.items.filter((i: any) => i._id !== id),
    }));
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "flex" : "hidden"} items-center justify-center bg-black/40`}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-lg">{mode === "create" ? "Create" : "Edit"} Employee</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <FormInput label="Name" value={form.name || ""} onChange={(v)=>setForm(p=>({...p,name:v}))}/>
          <FormInput label="Surname" value={form.surname || ""} onChange={(v)=>setForm(p=>({...p,surname:v}))}/>
          <FormInput label="Phone" value={form.phone || ""} onChange={(v)=>setForm(p=>({...p,phone:v}))}/>

          <FormSelect label="Department" value={form.department || ""} options={DEPARTMENTS} onChange={(v)=>setForm(p=>({...p,department:v}))}/>
          <FormSelect label="Position" value={form.position || ""} options={POSITIONS} onChange={(v)=>setForm(p=>({...p,position:v}))}/>

          <FormSelect
            label="Add Barcode"
            value={selectedBarcode}
            options={BARCODE_OPTIONS}
            onChange={(v)=>{
              setSelectedBarcode("");
              onBarcodeSelect(v);
            }}
          />

          {(form.items || []).map((item: any, i: number) => (
            <div key={item._id} className="flex justify-between items-center border p-3 rounded-lg">
              <div>
                <p className="font-semibold">{item.itemName}</p>
                <p className="text-xs text-gray-500">Barcode: {item.barCode}</p>
                <p className="text-xs text-gray-500">Available: {item.actualQty}</p>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={item.quantity ?? ""}
                  onChange={(e)=>{
                    const qty = Number(e.target.value);
                    setForm((prev:any)=>{
                      const next=[...prev.items];
                      next[i]={...next[i],quantity:qty};
                      return {...prev,items:next};
                    });
                  }}
                  className="w-20 border rounded px-2 py-1"
                />
                <button onClick={()=>removeItem(item._id)} className="text-red-500">
                  <X size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg">Cancel</button>
          <button onClick={onSave} disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}