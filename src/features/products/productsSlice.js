import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProductsFromAPI } from './productsAPI'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsFromAPI()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    all: [],
    filtered: [],
    reasons: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilteredProducts(state, action) {
      state.filtered = action.payload.map(item => item.id)
      const reasons = {}
      action.payload.forEach(item => {
        reasons[item.id] = item.reason
      })
      state.reasons = reasons
    },
    clearFiltered(state) {
      state.filtered = []
      state.reasons = {}
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'success'
        state.all = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Something went wrong'
      })
  },
})

export const { setFilteredProducts, clearFiltered } = productsSlice.actions
export default productsSlice.reducer
