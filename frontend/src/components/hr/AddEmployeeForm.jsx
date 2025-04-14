const AddEmployeeForm = () => {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Employee</h2>
        <form>
          <input type="text" placeholder="Full Name" className="input mb-2" />
          <input type="text" placeholder="Position" className="input mb-2" />
          <button type="submit" className="btn">Add</button>
        </form>
      </div>
    );
  };
  
  export default AddEmployeeForm;
  