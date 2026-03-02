import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: { name: "", email: "", phone: "", industry: "", size: "", address: "" },
    owner_name: "",
    owner_email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("company.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({ ...prev, company: { ...prev.company, [field]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (msg) { setMsg(""); setMsgType(""); }
  };

  const validateStep1 = () => {
    const e = {};
    if (!formData.company.name.trim()) e["company.name"] = "Company name required";
    if (!formData.company.email.trim()) e["company.email"] = "Company email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company.email)) e["company.email"] = "Invalid email";
    if (!formData.company.phone.trim()) e["company.phone"] = "Company phone required";
    if (!formData.company.address.trim()) e["company.address"] = "Company address required";
    if (!formData.company.size) e["company.size"] = "Select company size";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!formData.owner_name.trim()) e.owner_name = "Owner name required";
    if (!formData.owner_email.trim()) e.owner_email = "Owner email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) e.owner_email = "Invalid email";
    if (!formData.password) e.password = "Password required";
    else if (formData.password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { if (validateStep1()) setStep(2); return; }
    if (!validateStep2()) return;
    try {
      setLoading(true);
      const res = await apiClient.post("/register/", formData);
      if (res.data.success) {
        setMsgType("success");
        setMsg("Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else { setMsgType("error"); setMsg(res.data.message || "Registration failed"); }
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Server error. Please try again.");
    } finally { setLoading(false); }
  };

  const inputCls = (name) =>
    `w-full px-3 py-2 text-sm border ${errors[name] ? "border-red-400" : "border-gray-300"} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-200 rounded p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{step === 1 ? "Company Details" : "Owner Account"}</h2>
          <p className="text-sm text-gray-500 mb-4">{step === 1 ? "Tell us about your organization" : "Create your admin credentials"}</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>{step > 1 ? "✓" : "1"}</div>
            <span className="text-xs text-gray-500">Company</span>
            <div className={`flex-1 h-px ${step > 1 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
            <span className="text-xs text-gray-500">Owner</span>
          </div>

          {msg && (
            <div className={`p-3 mb-4 rounded text-sm ${msgType === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {step === 1 && (
              <>
                <div>
                  <input name="company.name" placeholder="Company Name" value={formData.company.name} onChange={handleChange} className={inputCls("company.name")} />
                  {errors["company.name"] && <p className="text-red-500 text-xs mt-1">{errors["company.name"]}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input name="company.email" placeholder="Company Email" value={formData.company.email} onChange={handleChange} className={inputCls("company.email")} />
                    {errors["company.email"] && <p className="text-red-500 text-xs mt-1">{errors["company.email"]}</p>}
                  </div>
                  <div>
                    <input name="company.phone" placeholder="Phone Number" value={formData.company.phone} onChange={handleChange} className={inputCls("company.phone")} />
                    {errors["company.phone"] && <p className="text-red-500 text-xs mt-1">{errors["company.phone"]}</p>}
                  </div>
                </div>
                <div>
                  <input name="company.address" placeholder="Company Address" value={formData.company.address} onChange={handleChange} className={inputCls("company.address")} />
                  {errors["company.address"] && <p className="text-red-500 text-xs mt-1">{errors["company.address"]}</p>}
                </div>
                <div>
                  <select name="company.size" value={formData.company.size} onChange={handleChange} className={inputCls("company.size")}>
                    <option value="">Company Size</option>
                    {companySizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors["company.size"] && <p className="text-red-500 text-xs mt-1">{errors["company.size"]}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <input name="owner_name" placeholder="Full Name" value={formData.owner_name} onChange={handleChange} className={inputCls("owner_name")} />
                  {errors.owner_name && <p className="text-red-500 text-xs mt-1">{errors.owner_name}</p>}
                </div>
                <div>
                  <input name="owner_email" placeholder="Email Address" value={formData.owner_email} onChange={handleChange} className={inputCls("owner_email")} />
                  {errors.owner_email && <p className="text-red-500 text-xs mt-1">{errors.owner_email}</p>}
                </div>
                <div>
                  <input type="password" name="password" placeholder="Password (min 8 characters)" value={formData.password} onChange={handleChange} className={inputCls("password")} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </>
            )}

            <div className={`flex ${step === 2 ? "justify-between" : "justify-end"} pt-2`}>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                  ← Back
                </button>
              )}
              <button disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Processing..." : step === 1 ? "Next →" : "Create Account"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;