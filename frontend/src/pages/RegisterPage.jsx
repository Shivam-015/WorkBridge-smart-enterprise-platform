import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  Briefcase,
  Users,
  Globe,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Company details
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    company_website: "",
    industry: "",
    company_size: "",
    founded_year: "",
    tax_id: "",
    
    // Admin details
    admin_name: "",
    admin_email: "",
    admin_phone: "",
    password: "",
    confirm_password: "",
    
    // Terms
    agree_terms: false,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success', 'error'
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Hospitality",
    "Consulting",
    "Other",
  ];

  // Comprehensive handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    } else {
      newValue = value;
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Special handling for confirm_password
    if (name === "password" || name === "confirm_password") {
      // Clear confirm_password error when password changes
      if (name === "password" && errors.confirm_password) {
        setErrors(prev => ({
          ...prev,
          confirm_password: null
        }));
      }
    }

    // Clear general message when user makes any change
    if (message) {
      setMessage("");
      setMessageType("");
    }

    // Real-time validation for specific fields
    if (name === "company_email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          company_email: "Please enter a valid email address"
        }));
      }
    }

    if (name === "admin_email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          admin_email: "Please enter a valid email address"
        }));
      }
    }

    if (name === "company_phone" && value) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setErrors(prev => ({
          ...prev,
          company_phone: "Phone number must have at least 10 digits"
        }));
      }
    }

    if (name === "admin_phone" && value) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setErrors(prev => ({
          ...prev,
          admin_phone: "Phone number must have at least 10 digits"
        }));
      }
    }

    if (name === "password" && value) {
      const errors = [];
      if (value.length < 8) errors.push("at least 8 characters");
      if (!/(?=.*[a-z])/.test(value)) errors.push("a lowercase letter");
      if (!/(?=.*[A-Z])/.test(value)) errors.push("an uppercase letter");
      if (!/(?=.*\d)/.test(value)) errors.push("a number");
      
      if (errors.length > 0) {
        setErrors(prev => ({
          ...prev,
          password: `Password must contain ${errors.join(", ")}`
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          password: null
        }));
      }
    }

    if (name === "confirm_password" && value && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirm_password: "Passwords do not match"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirm_password: null
        }));
      }
    }

    if (name === "company_website" && value) {
      if (value && !/^https?:\/\//.test(value)) {
        setErrors(prev => ({
          ...prev,
          company_website: "Website must start with http:// or https://"
        }));
      }
    }

    if (name === "founded_year" && value) {
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        setErrors(prev => ({
          ...prev,
          founded_year: `Year must be between 1800 and ${currentYear}`
        }));
      }
    }
  };

  // Handle select changes (separate function for select inputs)
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle input blur for validation
  const handleBlur = (e) => {
    const { name, value, required } = e.target;
    
    if (required && !value) {
      setErrors(prev => ({
        ...prev,
        [name]: `${name.split('_').join(' ')} is required`
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.company_name?.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.company_email?.trim()) {
      newErrors.company_email = "Company email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
      newErrors.company_email = "Invalid email format";
    }

    if (!formData.company_phone?.trim()) {
      newErrors.company_phone = "Company phone is required";
    } else {
      const phoneDigits = formData.company_phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.company_phone = "Phone number must have at least 10 digits";
      }
    }

    if (!formData.company_address?.trim()) {
      newErrors.company_address = "Company address is required";
    }

    if (formData.company_website && !/^https?:\/\/.+/.test(formData.company_website)) {
      newErrors.company_website = "Invalid website URL (include http:// or https://)";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry type is required";
    }

    if (!formData.company_size) {
      newErrors.company_size = "Company size is required";
    }

    if (formData.founded_year) {
      const year = parseInt(formData.founded_year);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        newErrors.founded_year = `Year must be between 1800 and ${currentYear}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.admin_name?.trim()) {
      newErrors.admin_name = "Admin name is required";
    }

    if (!formData.admin_email?.trim()) {
      newErrors.admin_email = "Admin email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email)) {
      newErrors.admin_email = "Invalid email format";
    }

    if (!formData.admin_phone?.trim()) {
      newErrors.admin_phone = "Admin phone is required";
    } else {
      const phoneDigits = formData.admin_phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.admin_phone = "Phone number must have at least 10 digits";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (!formData.agree_terms) {
      newErrors.agree_terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      nextStep();
      return;
    }

    if (!validateStep2()) {
      setMessageType("error");
      setMessage("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // Prepare data for API - remove confirm_password and agree_terms
      const { confirm_password, agree_terms, ...apiData } = formData;
      
      // Log the data being sent (for debugging)
      console.log("Sending registration data:", apiData);

      const response = await apiClient.post("/api/company/register/", apiData);
      
      console.log("Registration response:", response.data);

      if (response.data.success) {
        setMessageType("success");
        setMessage(response.data.message || "Registration successful! Please check your email.");
        
        // Reset form
        setFormData({
          company_name: "",
          company_email: "",
          company_phone: "",
          company_address: "",
          company_website: "",
          industry: "",
          company_size: "",
          founded_year: "",
          tax_id: "",
          admin_name: "",
          admin_email: "",
          admin_phone: "",
          password: "",
          confirm_password: "",
          agree_terms: false,
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessageType("error");
        setMessage(response.data.message || "Registration failed");
        
        // Handle field-specific errors from API
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      setMessageType("error");
      
      if (error.response) {
        // Server responded with error
        console.log("Error response:", error.response.data);
        setMessage(error.response.data?.message || "Registration failed");
        
        // Handle field-specific errors
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }
      } else if (error.request) {
        // Request made but no response
        setMessage("Network error. Please check your connection.");
      } else {
        // Something else happened
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Removed InputField component: using simple inline inputs instead

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] -z-10" />
      
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Company Registration
          </h2>
          <p className="text-gray-500 mt-2">
            Join WorkBridge and start building your team
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              1
            </div>
            <div className={`w-16 h-1 mx-2 ${
              currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              messageType === "success" 
                ? "bg-green-50 text-green-700 border-l-4 border-green-500" 
                : "bg-red-50 text-red-700 border-l-4 border-red-500"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Company Information
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.company_name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    placeholder="Company Name"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.company_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.company_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="company_email"
                      value={formData.company_email || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.company_email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                      placeholder="Company Email"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.company_email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.company_email}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="company_phone"
                      value={formData.company_phone || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.company_phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                      placeholder="Company Phone"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.company_phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.company_phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="company_address"
                    value={formData.company_address || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.company_address ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    placeholder="Company Address"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.company_address && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.company_address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="company_website"
                      value={formData.company_website || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.company_website ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                      placeholder="Company Website"
                      disabled={loading}
                    />
                  </div>
                  {errors.company_website && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.company_website}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="founded_year"
                      value={formData.founded_year || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.founded_year ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                      placeholder="Founded Year"
                      disabled={loading}
                    />
                  </div>
                  {errors.founded_year && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.founded_year}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry Type Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="industry"
                      value={formData.industry || ""}
                      onChange={handleSelectChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-10 py-2.5 border ${
                        errors.industry ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white`}
                      disabled={loading}
                      required
                    >
                      <option value="">Select Industry Type</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.industry && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.industry}
                    </p>
                  )}
                </div>

                {/* Company Size Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="company_size"
                      value={formData.company_size || ""}
                      onChange={handleSelectChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-10 py-2.5 border ${
                        errors.company_size ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white`}
                      disabled={loading}
                      required
                    >
                      <option value="">Select Company Size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size} employees
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.company_size && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.company_size}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID / Registration Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.tax_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    placeholder="Tax ID / Registration Number"
                    disabled={loading}
                  />
                </div>
                {errors.tax_id && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.tax_id}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Admin Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Admin Account Setup
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="admin_name"
                      value={formData.admin_name || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.admin_name ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                      placeholder="Admin Full Name"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.admin_name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.admin_name}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="admin_phone"
                      value={formData.admin_phone || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.admin_phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                      placeholder="Admin Phone"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.admin_phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.admin_phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="admin_email"
                    value={formData.admin_email || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.admin_email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    placeholder="Admin Email"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.admin_email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.admin_email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-10 py-2.5 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Create password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-10 py-2.5 border ${
                        errors.confirm_password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Confirm password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.confirm_password}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agree_terms"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.agree_terms && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.agree_terms}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                disabled={loading}
              >
                Previous
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                currentStep === 1 ? "ml-auto" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {currentStep === 2 ? "Registering..." : "Processing..."}
                </>
              ) : (
                <>
                  {currentStep === 1 ? "Next" : "Complete Registration"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;