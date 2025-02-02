import { useState } from "react";
import { update, resetPassword, auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/auth";
import toast from "react-hot-toast";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [avatar, setAvatar] = useState(user.photoURL || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (displayName === user.displayName && avatar === user.photoURL) {
      toast.error("Hiçbir değişiklik yapılmadı.");
      return;
    }

    setLoading(true);
    try {
      const result = await update({
        displayName,
        photoURL: avatar,
      });

      if (result) {
        toast.success("Profil başarıyla güncellendi!");
        dispatch(
          login({
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            emailVerified: auth.currentUser.emailVerified,
            photoURL: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
          })
        );
      }
    } catch (error) {
      toast.error("Profil güncelleme sırasında bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Yeni bir parola girmelisiniz.");
      return;
    }

    setLoading(true);
    try {
      const currentPassword = prompt("Mevcut şifrenizi giriniz:");
      if (!currentPassword) return;

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      const result = await resetPassword(password);
      if (result) {
        toast.success("Parola başarıyla güncellendi!");
        setPassword("");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Mevcut şifrenizi yanlış girdiniz.");
      } else {
        toast.error("Parola güncellenemedi: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isProfileChanged =
    displayName !== user.displayName || avatar !== user.photoURL;

  return (
    <div className="grid gap-y-10">
      {/* Profil Güncelleme Formu */}
      <form onSubmit={handleSubmit} className="grid gap-y-4">
        <h1 className="text-xl font-bold mb-4">Profili Güncelle</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ad-Soyad</label>
          <div className="mt-1">
            <input
              type="text"
              placeholder="Ad-Soyad"
              className="shadow-sm block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fotoğraf</label>
          <div className="mt-1">
            <input
              type="text"
              placeholder="Fotoğraf URL'si"
              className="shadow-sm block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
          {avatar && (
            <div className="mt-2">
              <img
                src={avatar}
                alt="Avatar Önizleme"
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}
        </div>
        <div>
          <button
            disabled={!isProfileChanged || loading}
            className="text-white disabled:opacity-20 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
          >
            {loading ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </div>
      </form>

      {/* Parola Güncelleme Formu */}
      <form onSubmit={handleResetSubmit} className="grid gap-y-4">
        <h1 className="text-xl font-bold mb-4">Parolayı Güncelle</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700">Parola</label>
          <div className="mt-1">
            <input
              type="password"
              placeholder="Yeni Parola"
              className="shadow-sm block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            disabled={!password || loading}
            className="text-white disabled:opacity-20 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
          >
            {loading ? "Güncelleniyor..." : "Parolayı Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
