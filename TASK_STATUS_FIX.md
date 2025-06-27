# Task Status Fix - Hiển thị chính xác trạng thái hoàn thành của task

## Vấn đề
Trước đây, hàm `listTasks` chỉ lấy danh sách task cơ bản mà không bao gồm thông tin về trạng thái hoàn thành (`completed`). Điều này dẫn đến việc tất cả các task đều hiển thị dấu ✗ (chưa hoàn thành) bất kể trạng thái thực tế của chúng.

## Giải pháp

### 1. Cập nhật hàm `listTasks` trong `asana/tasks.js`
- Thêm tham số `opt_fields` vào API call để lấy thông tin chi tiết của task
- Bao gồm các trường: `gid`, `name`, `completed`, `due_on`, `assignee`, `notes`

### 2. Thêm hàm `getTask` mới
- Tạo hàm để lấy thông tin chi tiết của một task cụ thể
- Hữu ích cho debugging và các tính năng tương lai
- Bao gồm thêm các trường: `created_at`, `modified_at`, `projects`

### 3. Cập nhật exports và type definitions
- Thêm `getTask` vào exports trong `asana/index.js`
- Cập nhật type definitions trong `asana/index.d.ts`

## Kết quả

Sau khi sửa đổi:
- ✓ Tasks đã hoàn thành hiển thị dấu ✓ (màu xanh)
- ✗ Tasks chưa hoàn thành hiển thị dấu ✗ (màu đỏ)
- Thông tin trạng thái được lấy trực tiếp từ Asana API

## Test

Để test các thay đổi:

```bash
# Test trực tiếp API
node test-list-tasks.js

# Test qua MCP server
npm run build
node dist/simple-client.js list-tasks
```

## Files đã thay đổi

1. `asana/tasks.js` - Cập nhật `listTasks` và thêm `getTask`
2. `asana/index.js` - Thêm export cho `getTask`
3. `asana/index.d.ts` - Thêm type definition cho `getTask`
4. `test-list-tasks.js` - Script test mới để kiểm tra functionality

## API Fields được lấy

### listTasks
- `gid` - Task ID
- `name` - Tên task
- `completed` - Trạng thái hoàn thành (boolean)
- `due_on` - Ngày hết hạn
- `assignee` - Người được giao task
- `notes` - Ghi chú

### getTask
- Tất cả fields của `listTasks` plus:
- `created_at` - Thời gian tạo
- `modified_at` - Thời gian sửa đổi cuối
- `projects` - Danh sách projects chứa task