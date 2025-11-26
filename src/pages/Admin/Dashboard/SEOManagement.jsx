import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";

export default function SEOManagement({ setActiveTab, setSelectedSEO }) {
  const [type, setType] = useState("tour");
  const [data, setData] = useState([]);

  const api = DataService();

  const fetchList = async () => {
    try {
      let res = [];

      if (type === "tour") res = await api.get(API.GET_TOURS);
      else if (type === "visa") res = await api.get(API.GET_VISAS);
      else res = await api.get(API.GET_ALL_HOLIDAY_TOURS);

      setData(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, [type]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#721011] mb-6">SEO Manager</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="tour">Tours</option>
          <option value="visa">Visa</option>
          <option value="holiday">Holiday Tours</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{item.title}</td>

                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedSEO({ type, id: item._id });
                      setActiveTab("seoEditor");
                    }}
                    className="bg-[#e82429] text-white px-4 py-2 rounded-lg"
                  >
                    Edit SEO
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!data.length && (
          <p className="text-center text-gray-500 py-4">No Records Found</p>
        )}
      </div>
    </div>
  );
}
