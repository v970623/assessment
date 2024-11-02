import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  IconButton,
  Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { SearchParams } from "../types/application";

interface SearchProps {
  onSearch: (params: SearchParams) => void;
}

export const ApplicationSearch = ({ onSearch }: SearchProps) => {
  const [expanded, setExpanded] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    const params: SearchParams = {};
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    onSearch(params);
  };

  const handleReset = () => {
    setKeyword("");
    setStatus("");
    onSearch({});
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        startIcon={expanded ? <CloseIcon /> : <FilterListIcon />}
        onClick={() => setExpanded(!expanded)}
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
      >
        {expanded ? "收起筛选" : "展开筛选"}
      </Button>

      <Collapse in={expanded}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <TextField
            label="搜索关键词"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            size="small"
            placeholder="搜索标题或内容"
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>状态</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="状态"
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value="new">新申请</MenuItem>
              <MenuItem value="pending">处理中</MenuItem>
              <MenuItem value="accepted">已接受</MenuItem>
              <MenuItem value="rejected">已拒绝</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            搜索
          </Button>

          <Button variant="outlined" onClick={handleReset}>
            重置
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
};
