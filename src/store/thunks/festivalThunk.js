import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig";
import axios from "axios";

const festivalIndex = createAsyncThunk(
 'festivalSlice/festivalIndex',
  async () => {
   const url = `${axiosConfig.baseUrl}/searchFestival2`; 
   const params = {
     serviceKey: axiosConfig.serviceKey,
     MobileOS: axiosConfig.MobileOS,
     MobileApp: axiosConfig.MobileApp,
     _type: 'json',
     arrange: axiosConfig.arrange,
     eventStartDate: '20250401'
   }
   const response = await axios.get(url, {params});
   return response.data.response.body;
  }
);

export {
   festivalIndex,

 };