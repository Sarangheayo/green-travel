import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig";
import axios from "axios";

const festivalIndex = createAsyncThunk(
 'festivalSlice/festivalIndex',
  async (page) => {
   const url = `${axiosConfig.BASE_URL}/searchFestival2`; 
   const config = {
      params:  {
          serviceKey: axiosConfig.SERVICE_KEY,
          MobileOS: axiosConfig.MOBILE_OS,
          MobileApp: axiosConfig.MOBILE_APP,
          _type: axiosConfig.TYPE,
          arrange: axiosConfig.ARRANGE,
          numOfRows: axiosConfig.NUM_OF_ROWS,
          pageNo: page,
          eventStartDate: '20250401'
      }
    }

   const response = await axios.get(url, config);

   return response.data.response.body;
  }
);

export { festivalIndex };