import { useState } from "react";
import  {login  }from "../firebase";
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const user = await login(email, password)
    if(user){
    navigate ('/', {
      replace: true
    })
  }
  };
  return (
    <form
      className="max-w-xl mx-auto grid gap-y-4 py-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          E-posta
        </label>
        <div className="mt-1">
          <input
            type="email"
            placeholder="you@example.com"
            className="shadow-sm block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Parola
        </label>
        <div className="mt-1">
          <input
            type="password"
            placeholder="*****"
            className="shadow-sm block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          disabled={!email || !password}
          className="text-white disabled:opacity-20 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm bg-indigo-600  hover:bg-indigo-700  rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
          type="submit"
        >
          Giriş Yap
        </button>
      </div>
    </form>
  );
}
