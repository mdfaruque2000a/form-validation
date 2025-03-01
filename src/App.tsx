//import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
//import "./App.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientSideRowModelModule } from "ag-grid-community";
import * as z from "zod";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().refine(value => !value || /^[0-9]{10,15}$/.test(value), {
    message: "Phone number must be 10-15 digits",
  }),
  role: z.enum(["Developer", "Designer", "Manager"], {
    errorMap: () => ({ message: "Role is required" })
  }),
  joiningDate: z.string().refine(value => new Date(value) <= new Date(), {
    message: "Joining date must be in the past or today",
  }),
});


function App() {
  //const [count, setCount] = useState(0);
  const [employees, setEmployees] = useState(() => {
    const savedData = localStorage.getItem("employees");
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = (data) => {
    setEmployees([...employees, data]);
    reset();
    sendEmail(data);
  };

  const sendEmail = async (data) => {
    try {
      console.log("Sending email with data:", data);
      // Integrate actual email sending logic here
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Email sending failed", error);
    }
  };

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Phone Number", field: "phone", sortable: true, filter: true },
    { headerName: "Role", field: "role", sortable: true, filter: true },
    { headerName: "Joining Date", field: "joiningDate", sortable: true, filter: true },
  ];

  return (
    <>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Employee Details Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input {...register("name")} className="w-full p-2 border rounded" required />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register("email")} className="w-full p-2 border rounded" required />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input {...register("phone")} className="w-full p-2 border rounded" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select {...register("role")} className="w-full p-2 border rounded" required>
            <option value="">Select a role</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Joining Date</label>
          <input type="date" {...register("joiningDate")} className="w-full p-2 border rounded" required />
          {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate.message}</p>}
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
      </form>
      <div className="ag-theme-alpine mt-6" style={{ height: 300, width: 1000 }}>
        <AgGridReact rowData={employees} columnDefs={columns} modules={[ClientSideRowModelModule]} pagination={true} />
      </div>
    </div>

      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <Button>Click me</Button> */}
    </>
  );
}

export default App;
