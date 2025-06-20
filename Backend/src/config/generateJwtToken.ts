import jwt from 'jsonwebtoken'

export const generateAuthToken = (id: string, role: string) : string =>{
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const token = jwt.sign({_id : id , role : role},process.env.JWT_SECRET,{expiresIn:'10d'}).toString();
  return token
} 