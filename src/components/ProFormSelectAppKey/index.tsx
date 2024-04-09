import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/components/HeaderContent";
import { useModel } from "@@/exports";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  IconButton,
  Input,
  InputProps,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import ListSubheader from "@mui/material/ListSubheader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useDebounce } from "ahooks";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const ProFormSelectAppKey: React.FC<
  {
    name?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: any) => void;
  } & InputProps
> = forwardRef(({ defaultValue, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const [searchValue, setSearch] = useState<string>("");
  const debouncedValue = useDebounce(searchValue, { wait: 100 });

  const { initialState } = useModel("@@initialState");
  let apps: boxjs.App[] = [];
  Object.values(initialState?.boxdata.appSubCaches || {}).forEach((item) => {
    apps = [...apps, ...item.apps.filter((item) => !!item.keys)];
  });
  apps = [...apps, ...(initialState?.boxdata.sysapps || [])].filter((item) => {
    if (item.name.indexOf(debouncedValue) > -1 || !debouncedValue) return true;
    return !!item.keys.find((key) => key.indexOf(debouncedValue) > -1);
  });
  const boxJsData = initialState?.boxdata.datas;

  useImperativeHandle(ref, () => {
    return { value };
  });

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onClose = () => {
    setOpen(false);
    setSearch("");
  };

  const handelChange = (val?: string) => {
    setValue(val);
    props.onChange?.({ target: { name: props.name, value: val } });
  };

  return (
    <>
      <Input
        value={value}
        {...props}
        size="small"
        type={"text"}
        endAdornment={
          <IconButton
            size="small"
            aria-label={props.name}
            onClick={() => {
              setOpen(true);
            }}
          >
            <KeyboardDoubleArrowRightIcon fontSize="small" />
          </IconButton>
        }
      />
      <Dialog
        onClose={() => onClose()}
        open={open}
        sx={{ "& .MuiDialog-paper": { width: `100%` } }}
      >
        <AppBar position="static">
          <Toolbar>
            <Search>
              <StyledInputBase
                placeholder="请输入应用名称或缓存Key"
                inputProps={{ "aria-label": "search" }}
                onChange={(value) => {
                  setSearch(value.target.value);
                }}
              />
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
            </Search>
          </Toolbar>
        </AppBar>
        <List
          subheader={<li />}
          sx={{
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
            "& ul": { padding: 0 },
          }}
        >
          <RadioGroup
            name="radio-buttons-group"
            onChange={(_, val) => {
              handelChange(val);
            }}
          >
            {apps.length > 0 ? (
              apps.map((item, index) => {
                const id = `${item.id}_${item.author}_${index}`;
                return (
                  <li
                    key={`section-${id}`}
                    style={{ width: `100%`, boxSizing: "border-box" }}
                  >
                    <ListSubheader
                      sx={{
                        borderBottom: `1px solid rgba(0, 0, 0, .125)`,
                        mt: 0,
                      }}
                    >
                      {item?.name}（{item?.keys?.length}）
                    </ListSubheader>

                    {item?.keys?.map((keyItem) => {
                      return (
                        <ListItem
                          sx={{ p: 0, pl: 3, pr: 3 }}
                          key={`${id}-${keyItem}`}
                        >
                          <ListItemText
                            id={id}
                            primary={
                              <FormControlLabel
                                value={keyItem}
                                control={<Radio />}
                                label={keyItem}
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    maxWidth: "90%",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "noWrap",
                                  },
                                }}
                              />
                            }
                            primaryTypographyProps={{
                              noWrap: true,
                              variant: "caption",
                              sx: { fontWeight: "bold" },
                            }}
                            secondary={
                              <Typography
                                noWrap
                                color="grey"
                                variant="caption"
                                component={"div"}
                              >
                                {(typeof boxJsData?.[keyItem] === "object" &&
                                !!boxJsData?.[keyItem]
                                  ? JSON.stringify(boxJsData?.[keyItem])
                                  : boxJsData?.[keyItem]) || "无数据"}
                              </Typography>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </li>
                );
              })
            ) : (
              <ListItem sx={{ height: 290, textAlign: "center" }}>
                <ListItemText primary={"未找到相关结果"} />
              </ListItem>
            )}
          </RadioGroup>
        </List>
        <DialogActions sx={{ borderTop: `1px solid rgba(0, 0, 0, .125)` }}>
          <Button onClick={() => onClose()}>取消</Button>
          <Button onClick={() => onClose()} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
export default ProFormSelectAppKey;
