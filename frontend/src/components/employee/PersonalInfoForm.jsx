const PersonalInfoForm = () => {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Update Personal Info</h2>
        <form>
          <input type="text" placeholder="Name" className="input mb-2" />
          <input type="email" placeholder="Email" className="input mb-2" />
          <button type="submit" className="btn">Update</button>
        </form>
      </div>
    );
  };
  
  export default PersonalInfoForm;
  