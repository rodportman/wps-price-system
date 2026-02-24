<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <img class="logo" src="/src/assets/wheelpersonLogo.png" alt="Logo" />
      <h1 v-if="currentLanguage === 'zh'" style="margin-bottom: 0px">
        深圳市威普塞船舶科技有限公司
      </h1>
      <h2 v-else style="margin: 24px 0">heelperson MARINE CO.,LTD</h2>
      <p v-if="currentLanguage === 'zh'">船艇设备一站式服务商</p>
      <p v-else>Marine Equipment One-Stop Service Provider</p>
      <p v-if="!isPrintMode">（人民币综合版）</p>
      <div class="contact-grid" v-if="currentLanguage === 'zh'">
        <div class="grid-item">
          地址：深圳市小鹏新区葵涌街道坝光新村西区8栋B2401
        </div>
        <div class="grid-item">网址：www.psmarine.com</div>
        <div class="grid-item">邮箱：heelperson@sina.com</div>
        <div class="grid-item">电话：18026963905</div>
      </div>
      <div class="contact-grid-eng" v-else>
        <div class="grid-item-eng">
          Address：Room 2401, Unit B, Building 8, Ba Guang Western District, No.
          2 Feng Shu Shan Rd, Kui Chong Sub-District, Dapeng New District,
          Shenzhen, China
        </div>
        <div class="grid-item-eng-s">
          <span>Net：www.psmarine.com</span
          ><span>E-mail：heelperson@sina.com</span
          ><span>Tel：18026963950</span>
        </div>
      </div>
    </div>
    <!-- 报价区域 -->
    <h2 v-if="currentLanguage === 'zh'" class="title1">产品报价单</h2>
    <h2 v-else class="title1">Product Quotation</h2>

    <!-- 搜索框盒子 -->
    <div class="search-section" v-if="!isPrintMode">
      <div class="range-box">
        <span class="search-label">产品范围:</span>
        <el-select
          v-model="ProductRange"
          @change="ProductRangeChange"
          style="width: 80px"
        >
          <el-option label="NAV" value="nav"></el-option>
          <el-option label="BSS" value="ecsBSS"></el-option>
          <el-option label="BEP" value="ecsBEP"></el-option>
          <el-option label="CZONE" value="ecsCZONE"></el-option>
          <el-option label="MASTERVOLT" value="ecsMASTERVOLT"></el-option>
        </el-select>
      </div>
      <span class="search-label">搜索添加：</span>
      <div class="search-box">
        <el-select
          ref="selectRef"
          v-model="selectedProduct"
          filterable
          :filter-method="debouncedFilter"
          placeholder="输入或选择产品型号..."
          @change="handleSelect"
          clearable
          value-key="PartNumber"
          no-data-text="请输入或尝试其他关键字"
          @visible-change="onVisibleChange"
        >
          <el-option
            v-for="item in filteredProducts"
            :key="item.PartNumber"
            :label="item.PartNumber"
            :value="item"
            class="option-box"
          >
            <div class="option">
              <div class="search-box-item">
                <span>{{ item.PartNumber }}</span>
                <span
                  v-if="ProductRange === 'nav'"
                  style="color: #c73a64; font-size: 13px"
                  >RRP:¥{{ item.rawRRP }}</span
                >
                <span
                  v-if="ProductRange.includes('ecs')"
                  style="color: #c73a64; font-size: 13px"
                  >RRP:${{ item.rawRRP }}</span
                >
              </div>
              <div class="ellipsis">
                <span style="color: #000000">{{
                  currentLanguage === "zh"
                    ? item.chinese_short_descript || item.ShortDescription
                    : item.ShortDescription || item.chinese_short_descript
                }}</span>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
      <el-button
        @click="openBatchDialog"
        v-if="!isPrintMode"
        class="batch-add-button"
        >批量添加</el-button
      >
    </div>
    <!-- 搜索选择框这一整条的格式 -->
    <div class="search-customer-container">
      <!-- 客户资料盒子 -->
      <div class="customer-info" v-if="showCustomerInfo">
        <!-- <h3 style="margin: 0;">客户信息</h3> -->
        <div class="info-grid">
          <div
            v-for="(field, key) in customerFields"
            :key="key"
            :class="['info-item', { address: key === 'address' }]"
          >
            <label :for="key">{{ field.label }}：</label>
            <el-input
              v-if="!isPrintMode"
              :id="key"
              v-model="customerInfo[key]"
              :placeholder="`请输入${field.label}`"
              class="info-input"
            ></el-input>
            <span v-if="isPrintMode">{{ customerInfo[key] }}</span>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="left-section">
          <span v-if="currentLanguage === 'zh'" class="left-title"
            >报价单号: Q{{ quoteNumber }}</span
          >
          <span v-else class="left-title"
            >Quotation No: Q{{ quoteNumber }}</span
          >

          <span class="Currency-text"
            ><span v-if="currentLanguage === 'zh'">币种:</span>
            <span v-else>Currency Code:</span>
            <el-select
              v-if="!isPrintMode"
              v-model="selectedCurrency"
              @change="handleCurrencyChange"
              style="width: 90px"
            >
              <el-option label="人民币" value="CNY"></el-option>
              <el-option label="欧元" value="EUR"></el-option>
              <el-option label="美元" value="USD"></el-option> </el-select
            ><span v-if="isPrintMode">{{ selectedCurrency }}</span>
          </span>
          <div class="rate-grid" v-if="!isPrintMode">
            <span class="rate-text">1美元 ≈ </span
            ><el-input v-model="rateUSD" placeholder="CNY" type="number"
              ><template #suffix>¥</template>
            </el-input>
            <span class="rate-text">1欧元 ≈ </span>
            <el-input v-model="rateEUR" placeholder="CNY" type="number"
              ><template #suffix>¥</template>
            </el-input>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格盒子 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        :fit="true"
        row-key="uuid"
        ref="elTableRef"
      >
        <el-table-column min-width="30" v-if="!isPrintMode">
          <Rank class="drag-handle" style="cursor: move" />
        </el-table-column>
        <el-table-column label="#" min-width="30">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PartNumber"
          :label="currentLanguage === 'zh' ? '产品编码' : 'Product Code'"
          min-width="150"
        ></el-table-column>
        <el-table-column
          :label="currentLanguage === 'zh' ? '产品描述' : 'Product Description'"
          min-width="400"
        >
          <template #default="scope">
            <el-tooltip placement="top" :popper-style="{ maxWidth: '500px' }">
              <template #content>
                {{
                  currentLanguage === "zh"
                    ? scope.row.chinese_long_descript
                    : scope.row.Description
                }}
              </template>
              <span>{{
                currentLanguage === "zh"
                  ? scope.row.chinese_short_descript
                  : scope.row.ShortDescription
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="不同客户类型的价格"
          min-width="130px"
        >
          <template #header>
            <span v-if="isPrintMode">
              <span v-if="currentLanguage === 'zh'">价格</span>
              <span v-else>Price</span>
            </span>
            <el-select
              v-else
              v-model="selectedCustomerType"
              placeholder="选择客户类型"
              @change="handleCustomerTypeChange"
            >
              <el-option
                v-for="item in customerTypes"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              />
            </el-select>
          </template>
          <template #default="scope">
            {{ formatDisplayCurrency(getPriceType(scope.row)) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="currentLanguage === 'zh' ? '数量' : 'Qty'"
          min-width="80px"
        >
          <template #default="{ row }">
            <el-input
              v-if="!isPrintMode"
              v-model="row.quantity"
              @change="handleQuantityChange(row)"
              style="width: 50px"
              type="number"
              id="quantity-table"
              class="custom-input-number"
            ></el-input>
            <span v-if="isPrintMode">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="currentLanguage === 'zh' ? '金额' : 'Item Subtotal'"
          min-width="130px"
        >
          <template #default="{ row }">
            {{ formatDisplayCurrency(row.lineAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="currentLanguage === 'zh' ? '参考图' : 'Image'"
          min-width="130px"
        >
          <template #default="{ row }">
            <el-image :src="row.imageUrl" class="image-slot" fit="contain">
              <template #error>
                <div class="image-slot">NoImg</div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" v-if="!isPrintMode">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="openEditDialog(row)">
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="summary-bar">
        <div class="summary-cell">
          {{ currentLanguage === "zh" ? "合计" : "Total" }}
        </div>
        <div class="summary-cell">
          <span class="label">
            {{ currentLanguage === "zh" ? "数量" : "Quantity" }}：
          </span>
          <span class="value">
            {{ totalQty }}
          </span>
        </div>
        <div class="summary-cell">
          <span class="label">
            {{ currentLanguage === "zh" ? "金额" : "Total Amount" }}：
          </span>
          <span class="value amount">
            {{ formatDisplayCurrency(totalAmount) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="NewItemButton">
      <el-button @click="openAddCustomItemDialog" v-if="!isPrintMode"
        >增加自定义项 +</el-button
      >
      <el-button
        class="language-switch-button"
        @click="toggleLanguage"
        v-if="!isPrintMode"
      >
        <span v-if="currentLanguage === 'zh'">切换英文</span>
        <span v-else>切换中文</span>
      </el-button>
      <el-button
        class="bank-switch-button"
        @click="togglebank"
        v-if="!isPrintMode"
      >
        <span v-if="currentbank === 'continent'">付款香港</span>
        <span v-else>付款大陆</span>
      </el-button>
      <!-- 新增按钮：显示/隐藏客户信息 -->
      <el-button
        class="toggle-customer-info-button"
        @click="toggleCustomerInfo"
        v-if="!isPrintMode"
      >
        <span v-if="!showCustomerInfo">显示客户信息</span>
        <span v-else>隐藏客户信息</span>
      </el-button>
      <el-button @click="handleStamp" class="stamp-button" v-if="!isPrintMode">
        <span v-if="!showStamp">加盖公章/签名</span>
        <span v-else>取消公章/签名</span>
      </el-button>

      <el-button
        class="print-mode-button"
        @click="enterPrintMode"
        v-if="!isPrintMode"
        >物料生成<strong>丨</strong>打印PDF</el-button
      >
    </div>
    <!-- 新增自定义项弹窗 -->
    <el-dialog v-model="addCustomItemDialogVisible" title="新增项" width="30%">
      <el-form
        :model="newCustomItem"
        :rules="customItemRules"
        ref="customItemFormRef"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="产品编码：" prop="PartNumber">
          <el-input v-model="newCustomItem.PartNumber"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="ShortDescription">
          <el-input v-model="newCustomItem.ShortDescription"></el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="RRP">
          <el-input
            v-model.number="newCustomItem.RRP"
            type="number"
            @input="calculateTotalAmount"
            placeholder="无客户类型，无货币单位，固定值"
          ></el-input>
        </el-form-item>
        <el-form-item label="数量：" prop="quantity">
          <el-input-number
            v-model.number="newCustomItem.quantity"
            @input="calculateTotalAmount"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancelAddCustomItem">取消</el-button>
          <el-button type="primary" @click="addCustomItem">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog v-model="dialogVisible" title="修改" width="30%">
      <span>描述修改：</span
      ><el-input v-model="editDescription" type="text"></el-input>
      <span>价格修改：</span
      ><el-input v-model.number="editPrice" type="number"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 批量添加弹窗：支持粘贴多行编码或上传 Excel/CSV（第一列编码，第二列数量可选） -->
    <el-dialog v-model="batchDialogVisible" title="批量添加产品" width="520px">
      <div style="display: flex; gap: 0px; flex-direction: column">
        <span>方式一：复制粘贴PN及数量或输入多行产品编码</span>
        <el-input
          type="textarea"
          v-model="batchInput"
          :rows="4"
          placeholder="示例：&#10;000-16107-001&#10;000-16108-001&#10;000-16109-001"
        />
        <span>方式二：识别Excel（第一列为PN，第二列为数量可选）</span>
        <el-upload
          class="batchFileRef"
          :before-upload="handleBatchBeforeUpload"
          :show-file-list="false"
          accept=".xlsx,.xls,.csv"
        >
          <el-button type="primary">点击 识别EXCEL</el-button>
        </el-upload>
        <el-checkbox v-model="batchSkipExisting">跳过已存在项</el-checkbox>
        <div style="display: flex; justify-content: flex-end">
          <el-button @click="batchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="processBatch">开始添加</el-button>
        </div>
        <div v-if="batchNotFound.length" style="margin-top: 8px">
          <p style="margin: 0; font-weight: 600">
            未找到的编码（共 {{ batchNotFound.length }}）：
          </p>
          <div
            style="
              max-height: 120px;
              overflow: auto;
              border: 1px solid #f0f0f0;
              padding: 6px;
            "
          >
            <div v-for="(p, i) in batchNotFound" :key="i">{{ p }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <div v-if="currentLanguage === 'zh'" class="footer-text-explanation">
          <p>报价说明：</p>
          <!-- <p>1. 本报价单为：国内含税交货价。</p> -->
          <p>
            1. 本报价单为：
            <span>
              {{ currencyPrefix }}
            </span>
            <el-input
              v-if="!isPrintMode"
              v-model="Delivery"
              autosize
              type="textarea"
              placeholder="请输入交货相关信息"
              style="width: 240px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ Delivery }}</span>
          </p>
          <p>
            2. 付款方式：
            <el-input
              v-if="!isPrintMode"
              v-model="Payment"
              autosize
              type="textarea"
              placeholder="请输入付款方式"
              style="width: 260px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ Payment }}</span>
          </p>
          <p>
            3. 报价有效期：
            <el-input
              v-if="!isPrintMode"
              v-model="quoteValidity"
              autosize
              type="textarea"
              style="width: 120px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ quoteValidity }}</span>
          </p>
          <p>
            4. 交货期：
            <el-input
              v-if="!isPrintMode"
              v-model="deliveryPeriod"
              autosize
              type="textarea"
              placeholder="请输入货期信息"
              style="width: 260px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ deliveryPeriod }}</span>
          </p>
          <p>
            <span style="position: relative; display: inline-block">
              5. 报价单位（公司章）：深圳市威普塞船舶科技有限公司
              <img
                v-if="showStamp"
                src="/src/assets/company_stampdemo.png"
                alt="Company Stamp"
                style="
                  position: absolute;
                  right: -100px;
                  top: 50%;
                  transform: translateY(-70%);
                  max-width: 150px;
                  height: auto;
                "
              />
            </span>
          </p>
          <p>
            <span style="position: relative; display: inline-block">
              6. 签名：______________________
              <img
                v-if="showStamp"
                src="/src/assets/signdemo.png"
                alt="sign"
                style="
                  position: absolute;
                  right: 50px;
                  top: 45%;
                  transform: translateY(-65%);
                  max-width: 120px;
                  height: auto;
                "
              />
            </span>
          </p>
          <p>
            7. 日期：
            <el-input
              v-if="!isPrintMode"
              v-model="currentDate"
              autosize
              type="textarea"
              style="width: 260px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ currentDate }}</span>
          </p>
        </div>
        <div v-else class="footer-text-explanation">
          <p>Quotation Notes：</p>
          <!-- <p>1. 本报价单为：国内含税交货价。</p> -->
          <p>
            1. This quotation is：
            <span>
              {{ currencyPrefix }}
            </span>
            <el-input
              v-if="!isPrintMode"
              v-model="Delivery"
              autosize
              type="textarea"
              placeholder="请输入交货相关信息"
              style="width: 240px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ Delivery }}</span>
          </p>
          <p>
            2. Payment Terms：
            <el-input
              v-if="!isPrintMode"
              v-model="Payment"
              autosize
              type="textarea"
              placeholder="请输入付款方式"
              style="width: 260px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ Payment }}</span>
          </p>
          <p>
            3. Validity of Quotation：
            <el-input
              v-if="!isPrintMode"
              v-model="quoteValidity"
              autosize
              type="textarea"
              style="width: 120px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ quoteValidity }}</span>
          </p>
          <p>
            4. Delivery Date：
            <el-input
              v-if="!isPrintMode"
              v-model="deliveryPeriod"
              autosize
              type="textarea"
              placeholder="请输入货期信息"
              style="width: 260px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ deliveryPeriod }}</span>
          </p>
          <p>
            <span style="position: relative; display: inline-block">
              5. Quoting Party ：Shenzhen heelperson marine Co., Ltd
              <img
                v-if="showStamp"
                src="/src/assets/company_stampdemo.png"
                alt="Company Stamp"
                style="
                  position: absolute;
                  right: -100px;
                  top: 50%;
                  transform: translateY(-70%);
                  max-width: 150px;
                  height: auto;
                "
              />
            </span>
          </p>
          <p>
            <span style="position: relative; display: inline-block">
              6. Signature：______________________
              <img
                v-if="showStamp"
                src="/src/assets/sign.png"
                alt="sign"
                style="
                  position: absolute;
                  right: 50px;
                  top: 45%;
                  transform: translateY(-65%);
                  max-width: 120px;
                  height: auto;
                "
              />
            </span>
          </p>
          <p>
            7. Date：
            <el-input
              v-if="!isPrintMode"
              v-model="currentDate"
              autosize
              type="textarea"
              style="width: 260px"
              class="delivery-text"
            ></el-input>
            <span v-if="isPrintMode">{{ currentDate }}</span>
          </p>
        </div>
        <div
          class="bank-information-coninent"
          v-if="currentbank === 'continent'"
        >
          <p>开票/付款信息：</p>
          <p>1.收款名称：深圳市威普塞船舶科技有限公司</p>
          <p>2.开户银行：中国农业银行深圳葵涌支行</p>
          <p>3.银行账号：41023700140012443</p>
          <p>4.纳税人识别号：91440300326364117H</p>
          <p>5.纳税人名称：深圳市威普塞船舶科技有限公司</p>
          <p>
            6.地址：深圳市小鹏新区葵涌街道坝光社区
          </p>
          <p>7.联系方式：18026963905</p>
        </div>
        <div class="bank-information-hongkong" v-else>
          <p>BANK INFORMTION:</p>
          <p>1.COMPANY NAME :heelperson MARINE CO.,LIMITED</p>
          <p>2.NAME OF BANK: OCBC Wing Hang Bank Limited</p>
          <p>3.ACCOUNT NO.:035-802-075251-831</p>
          <p>4.SWIFT CODE : WIHBHKHH</p>
          <p>5.ADDRESS:161 Queen's Road Central</p>
          <p>6.Bank Code ：035</p>
          <p>7.Branch Code ：802</p>
        </div>
      </div>

      <img
        src="/src/assets/EamilLogo.png"
        alt="Wheelperson"
        style="max-width: 100%; height: auto; margin-top: 10px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import Sortable from "sortablejs";
import * as XLSX from "xlsx"; // 使用 import 导入 XLSX
import html2pdf from "html2pdf.js";
import { v4 as uuidv4 } from "uuid"; // 使用 UUID 生成唯一 ID，删除/修改都使用此id
// 货币相关状态
const selectedCurrency = ref("CNY"); // 实际使用的货币
const exchangeRate = ref(1); // 汇率储存，默认为 人民币兑人民币，为1
const rateUSD = ref(7.1863); // 美元汇率
const rateEUR = ref(8.1558); // 欧元汇率

// 产品的范围选择（电控/导航）
const ProductRange = ref("nav");

// 当前选中产品-修改弹窗相关
const selectedProduct = ref(null);
const dialogVisible = ref(false);
const currentEditRow = ref(null);
const editPrice = ref(0);
const editDescription = ref(""); // 新增描述变量
// 表格的原始数据
const originalTableData = ref([]);
// demo数据
const allProducts = ref([]);
// 动态Excel数据加载方法
const loadExcelData = async () => {
  try {
    // 动态选择文件路径
    const fileName = (() => {
      switch (ProductRange.value) {
        case "nav":
          return "/NAVPriceDataDemo.xlsx";
        case "ecsBSS":
          return "/BSSPriceData1.xlsx";
        case "ecsBEP":
          return "/BEPPriceData1.xlsx";
        case "ecsCZONE":
          return "/CZONEPriceData1.xlsx";
        case "ecsMASTERVOLT":
          return "/MASTERVOLTPriceData1.xlsx";
      }
    })();

    // 加载Excel文件
    const response = await fetch(fileName);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      console.error("Excel 文件中没有可用的工作表！");
      ElMessage.error("Excel 文件中没有可用的工作表！");
      return;
    }

    // 解析数据
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 处理数据结构
    const headers = {
      Brand: 0,
      PartNumber: 1,
      ShortDescription: 2,
      chinese_short_descript: 3,
      Description: 4,
      chinese_long_descript: 5,
      RRP: 6,
      RRP113: 7,
      Wholesaler: 8,
      Distributor: 9,
      OEM: 10,
      Dealer: 11,
      Retail: 12,
    };

    // 将excel转换数据格式，成为原始数据，未经处理
    const result = data.slice(1).map((row) => ({
      Brand: row[headers["Brand"]],
      PartNumber: String(row[headers["PartNumber"]]).trim(),
      ShortDescription: row[headers["ShortDescription"]],
      chinese_short_descript: row[headers["chinese_short_descript"]],
      Description: row[headers["Description"]],
      chinese_long_descript: row[headers["chinese_long_descript"]],
      rawRRP: row[headers["RRP"]],
      rawRRP113: row[headers["RRP113"]],
      rawWholesaler: row[headers["Wholesaler"]],
      rawDistributor: row[headers["Distributor"]],
      rawOEM: row[headers["OEM"]],
      rawDealer: row[headers["Dealer"]],
      rawRetail: row[headers["Retail"]],
      uuid: uuidv4(), // 注入唯一标识符
    }));

    // 更新产品列表
    allProducts.value = result;
  } catch (error) {
    console.error(`加载${ProductRange.value}数据失败`, error);
    ElMessage.error("数据加载失败，请检查文件是否存在");
  }
};
// 初始化加载数据
onMounted(() => {
  loadExcelData();
  // 排序功能初始化
  initSort();
  // 拼接原有标题与新编号
  document.title = `威普塞报价系统 - Q${quoteNumber.value}`;
  watch(
    () => customerInfo.name,
    (newName) => {
      if (newName) {
        document.title = `威普塞报价系统 - ${newName} - Q${quoteNumber.value}`;
      } else {
        document.title = `威普塞报价系统 - Q${quoteNumber.value}`;
      }
    }
  );
  // 监听键盘事件
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      exitPrintMode();
    }
  });
});

const deliveryPeriod = ref("待定"); // 新增货期输入框的默认值
const Payment = ref("100% 预付"); // 新增货期输入框的默认值
const Delivery = ref("国内含税交货价"); // 交货相关信息
// 新增计算属性
const currencyPrefix = computed(() => {
  if (currentLanguage.value === "zh") {
    const currencyMap = {
      CNY: "人民币报价,",
      EUR: "欧元报价，",
      USD: "美元报价，",
    };
    return currencyMap[selectedCurrency.value];
  } else {
    const currencyMap = {
      CNY: "quoted in CNY,",
      EUR: "quoted in EUR,",
      USD: "quoted in USD,",
    };
    return currencyMap[selectedCurrency.value];
  }
});
// 在 script setup 中声明 emits
const emit = defineEmits(["toggle-nav"]);

// 客户类型数据，在table中是已经被处理国的
const customerTypesNAV = [
  { type: "RRP", name: "RRP" },
  { type: "RRP113", name: "RRP*1.13" },
  { type: "Wholesaler", name: "批发商(含税RRP0.62)" },
  { type: "Distributor", name: "分销商(含税RRP0.65)" },
  { type: "OEM", name: "OEM(含税RRP0.67)" },
  { type: "Dealer", name: "零售(含税RRP*0.7)" },
  { type: "Retail", name: "普通(含税RRP*0.72)" },
];
const customerTypesECS = [
  { type: "RRP", name: "成本不含税" },
  { type: "RRP113", name: "RRP查询用" },
  { type: "Wholesaler", name: "成本不含税*1.15" },
  { type: "Distributor", name: "成本不含税*1.20" },
  { type: "OEM", name: "成本不含税*1.30" },
  { type: "Dealer", name: "成本不含税*1.40" },
  { type: "Retail", name: "无" },
];
// 客户资料数据
const customerInfo = reactive({
  name: "",
  contact: "",
  phone: "",
  address: "",
  remark: "",
});
const quoteNumber = ref(generateQuoteNumber());

// 生成报价单号
function generateQuoteNumber() {
  const now = new Date();
  // 年份最后一位
  const yearLastDigit = String(now.getFullYear()).slice(-1);

  // 计算当天是当年的第几天，完整 3 位
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = String(Math.floor(diff / oneDay)).padStart(3, "0");
  // 小时，2 位
  const hour = String(now.getHours()).padStart(2, "0");
  // 分钟，2 位
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${yearLastDigit}${dayOfYear}${hour}${minute}`;
}
// 总和计算部分
const totalAmount = ref(0);
const tableData = ref([]);
const totalQty = computed(() =>
  tableData.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
);

// 自动跟随客户类型变化
const customerTypes = ref(customerTypesNAV);
const selectedCustomerType = ref(customerTypes.value[0]?.type || "RRP");
// 监听产品范围变化
watch(ProductRange, () => {
  // 产品类型
  if (ProductRange.value.includes("ecs")) {
    customerTypes.value = customerTypesECS;
  } else {
    customerTypes.value = customerTypesNAV;
  }
  loadExcelData();
  updateRowsSubTotal(); // 切换范围时强制刷新所有金额
});
// 增加项 定义
const addCustomItemDialogVisible = ref(false);
const newCustomItem = ref({
  PartNumber: "",
  ShortDescription: "",
  Description: null,
  RRP: null, // 用户输入的原始价格
  quantity: 1,
  productType: "newAddItem", //不管现在是什么货币，固定不变
  uuid: "", // 默认为空，添加时注入
});
const customItemFormRef = ref(null);
const customItemRules = {
  ShortDescription: [
    { required: true, message: "描述不能为空", trigger: "blur" },
  ],
  RRP: [
    { required: true, message: "价格不能为空", trigger: "blur" },
    { type: "number", message: "价格必须为数字", trigger: "blur" },
  ],
  quantity: [
    { required: true, message: "数量不能为空", trigger: "blur" },
    { type: "number", message: "数量必须为数字", trigger: "blur" },
  ],
};

// 用于页面显示：带货币符号
const formatDisplayCurrency = (value) => {
  // console.log(value, " value");
  // 自定义项直接显示原始价格 + 单位
  return `${getCurrencySymbol()}${Number(value).toFixed(2)}`;
};
// 获取货币符号
const getCurrencySymbol = () => {
  const symbols = {
    CNY: "¥",
    EUR: "€",
    USD: "$",
  };
  return symbols[selectedCurrency.value]; // 默认为人民币符号
};
// 处理tableData中的货币变更
const handleCurrencyChange = (newCurrency) => {
  // 根据选中的货币设置汇率
  if (newCurrency === "CNY") {
    exchangeRate.value = 1; // 人民币汇率固定为1
  } else if (newCurrency === "USD") {
    exchangeRate.value = Number(rateUSD.value); // 使用手动输入的美元汇率
  } else if (newCurrency === "EUR") {
    exchangeRate.value = Number(rateEUR.value); // 使用手动输入的欧元汇率
  }
  console.log("newCurrency", newCurrency);
  // 更新表格中所有金额的显示
  updateRowsSubTotal();
};

// 这个方法是处理返回的客户类型，还有处理增加项的特殊情况
const getPriceType = (row) => {
  // 如果是自定义价格直接返回
  if (row.productType == "newAddItem") {
    return Number(row.RRP);
  } else {
    // 处理返回的客户类型
    const rawPrice = Number(row[selectedCustomerType.value]);
    // exchangeRate.value关联的是汇率的切换
    return rawPrice / exchangeRate.value;
  }
};
// 行小计的计算方法，这样小计总是按照显示的价格计算了
const updateRowsSubTotal = () => {
  tableData.value.forEach((row) => {
    // 统一使用基础价格 × 数量计算金额（基础价格已考虑汇率）
    row.lineAmount = (getPriceType(row) * row.quantity).toFixed(2);
  });
  console.log("tableData", tableData.value);
  calculateTotal();
};

// 点击选择产品选项时
const handleSelect = (product) => {
  // 用于处理用户选择产品时的逻辑，主要功能是防止重复添加相同产品
  if (!product) return;
  const exists = tableData.value.some(
    (item) =>
      String(item.PartNumber).trim() === String(product.PartNumber).trim()
  );
  if (exists) {
    const index = tableData.value.findIndex(
      (item) =>
        String(item.PartNumber).trim() === String(product.PartNumber).trim()
    );
    ElMessage.warning(`已选择此项，在序列号 ${index + 1}`);
    return;
  }
  // console.log(product, "product");
  // 将新产品添加到报价单表格
  const lineProductData = allProducts.value.find(
    (p) => String(p.PartNumber).trim() === String(product.PartNumber).trim()
  );

  if (!exists && lineProductData) {
    // 将要处理的原始数据，复制出来
    const newRow = {
      ...lineProductData,
      productType: ProductRange.value,
      quantity: 1,
      customPrice: null,
      RRP: lineProductData.rawRRP,
      RRP113: lineProductData.rawRRP113,
      Wholesaler: lineProductData.rawWholesaler,
      Distributor: lineProductData.rawDistributor,
      OEM: lineProductData.rawOEM,
      Dealer: lineProductData.rawDealer,
      Retail: lineProductData.rawRetail,
      imageUrl: `/NavicoImg/${lineProductData.PartNumber}.png`,
      uuid: uuidv4(), // 注入唯一标识符
    };
    originalTableData.value.push(newRow);
    dataProcessMethods(); //处理数据
  }
};
// SE 数字键enter的键盘选中功能
// SE悬停下拉框，enter可直接添加的键盘方法
const selectRef = ref(null);
const handleKeydown = (e) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    const select = selectRef.value;
    if (!select) return;

    // 触发当前悬停项选中
    const hovered = select.hoverOption;
    if (hovered) {
      select.handleOptionSelect(hovered);
    } else if (selectedProduct.value) {
      // 如果没有悬停项，则选中当前值
      handleSelect(selectedProduct.value);
    }
  }
};
// SE当下拉框展开或关闭时绑定/解绑监听
const onVisibleChange = async (visible) => {
  await nextTick();
  const input = selectRef.value?.$el.querySelector("input");
  if (!input) return;

  if (visible) {
    input.addEventListener("keydown", handleKeydown);
  } else {
    input.removeEventListener("keydown", handleKeydown);
  }
};
// 对添加进来的非人民币产品汇率进行处理）
const transformTableData = () => {
  // console.log(tableData.value, "tableData.value");
  tableData.value = originalTableData.value.map((item) => {
    if (item.productType.includes("ecs")) {
      return {
        ...item,
        RRP: (item.RRP * rateUSD.value).toFixed(2),
        RRP113: (item.RRP113 * rateUSD.value).toFixed(2),
        Wholesaler: (item.Wholesaler * rateUSD.value).toFixed(2),
        Distributor: (item.Distributor * rateUSD.value).toFixed(2),
        OEM: (item.OEM * rateUSD.value).toFixed(2),
        Dealer: (item.Dealer * rateUSD.value).toFixed(2),
        Retail: (item.Retail * rateUSD.value).toFixed(2),
      };
    }
    return item;
  });
  // console.log(tableData.value, "tableData.value");
};
// 处理表格数量变化，原数据的数量也要跟随变化才可以
const handleQuantityChange = (row) => {
  originalTableData.value.forEach((item) => {
    if (item.uuid === row.uuid) {
      item.quantity = row.quantity;
    }
  });
  // 计算金额时，使用最新的价格
  row.lineAmount = (getPriceType(row) * row.quantity).toFixed(2);
  updateRowsSubTotal();
  calculateTotal(); // 更新总额
};

// 总额计算
const calculateTotal = () => {
  totalAmount.value = tableData.value
    .reduce((sum, item) => sum + Number(item.lineAmount || 0), 0)
    .toFixed(2);
};
// 将多个常用的数据处理放在一起，节省代码
const dataProcessMethods = () => {
  transformTableData(); // ✅原数据处理成人民币
  updateRowsSubTotal(); // ✅ 更新行金额显示
  calculateTotal(); //✅总额计算
};
// 处理客户类型变更
const handleCustomerTypeChange = () => {
  dataProcessMethods(); // 更新总额
  console.log(tableData.value, "handleCustomerTypeChange");
};

// 处理删除行
const handleDelete = (row) => {
  console.log("handleDelete", row);
  const index = originalTableData.value.findIndex(
    (item) => item.uuid === row.uuid
  );
  if (index > -1) {
    originalTableData.value.splice(index, 1);
  }
  dataProcessMethods(); // 数据处理
  // 👇 新增：删除后清空 selectedProduct，确保下次选择能触发 handleSelect
  selectedProduct.value = null;
};
// 新增的价格修改方法
const openEditDialog = (row) => {
  console.log("openEditDialog", row);

  currentEditRow.value = row;
  editPrice.value = getPriceType(row);

  // 根据当前语言初始化描述
  editDescription.value =
    currentLanguage.value === "zh"
      ? row.chinese_short_descript || row.ShortDescription
      : row.ShortDescription || row.chinese_short_descript;
  dialogVisible.value = true;
};

// 修改确认编辑逻辑，一旦修改，将作为最高指令，不再产生其它变化
const confirmEdit = () => {
  if (currentEditRow.value) {
    const editedRow = currentEditRow.value;
    editedRow.RRP = Number(editPrice.value);
    editedRow.productType = "newAddItem";

    // 新增：根据当前语言更新对应描述字段
    if (currentLanguage.value === "zh") {
      currentEditRow.value.chinese_short_descript = editDescription.value;
    } else {
      currentEditRow.value.ShortDescription = editDescription.value;
    }

    updateRowsSubTotal();
    calculateTotal(); // 更新总额
    dialogVisible.value = false; // 关闭弹窗
  }
};

// 打开新增自定义项弹窗
const openAddCustomItemDialog = () => {
  // 清空表单数据
  newCustomItem.value = {
    PartNumber: "",
    ShortDescription: "",
    Description: null,
    RRP: null, // 用户输入的原始价格
    RRP113: null,
    Wholesaler: null,
    Distributor: null,
    OEM: null,
    Dealer: null, // 新增的含税价格
    Retail: null,
    quantity: 1,
    productType: "newAddItem", // 最高权限类型，修改了就不会变
  };
  addCustomItemDialogVisible.value = true;
};

// 确认添加自定义项
const addCustomItem = () => {
  customItemFormRef.value.validate((valid) => {
    if (valid) {
      const inputPrice = Number(newCustomItem.value.RRP) || 0;
      const quantity = Number(newCustomItem.value.quantity) || 1;

      const newRow = {
        ...newCustomItem.value, // 保留所有字段
        quantity: quantity,
        RRP: inputPrice,
        RRP113: inputPrice,
        Wholesaler: inputPrice,
        Distributor: inputPrice,
        OEM: inputPrice,
        Dealer: inputPrice, // 含税价格
        Retail: inputPrice,
        // 强制包含中文/英文描述字段
        chinese_short_descript: newCustomItem.value.ShortDescription,
        chinese_long_descript: newCustomItem.value.ShortDescription, // 可选
        Description: newCustomItem.value.ShortDescription,
        productType: "newAddItem",
        uuid: uuidv4(), // 注入唯一标识符
      };
      console.log(newRow, "newRow");

      originalTableData.value.push(newRow);
      // console.log("tableData", tableData);
      dataProcessMethods(); // 数据处理
      addCustomItemDialogVisible.value = false;
      handleCancelAddCustomItem();
    }
  });
};
//  防抖功能已实现
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    // 更简洁的写法
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};
const filteredProducts = ref(allProducts.value);
// 过滤方法 搜索添加时的过滤
const customFilter = (query) => {
  const q = query.toLowerCase().replace(/\s+/g, "").trim(); // 合并多余空格
  if (!q) {
    return;
  }

  filteredProducts.value = allProducts.value.filter((item) => {
    // 对每个字段都去除多余空格再匹配
    const partNumber = (item.PartNumber || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();
    const shortDesc = (item.ShortDescription || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();
    const chineseDesc = (item.chinese_short_descript || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();

    return (
      partNumber.includes(q) || shortDesc.includes(q) || chineseDesc.includes(q)
    );
  });
};
// 防抖调用
const debouncedFilter = debounce(customFilter, 500);

// footer的相关的逻辑
// 当前日期
const currentDate = ref(getFormattedDate());
// 报价有效期（可修改）
const quoteValidity = ref("30天"); // 默认有效期为30天
// 获取格式化后的当前日期
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

// 验证报价有效期输入
// const validateQuoteValidity = () => {
//   if (
//     isNaN(quoteValidity.value) ||
//     quoteValidity.value < 0 ||
//     quoteValidity.value > 999
//   ) {
//     // 如果输入无效，重置为默认值 30
//     quoteValidity.value = 30;
//   } else {
//     // 确保值为整数
//     quoteValidity.value = Math.floor(Number(quoteValidity.value));
//   }
// };

const showStamp = ref(false);

// 盖公章功能
const handleStamp = () => {
  if (showStamp.value) {
    showStamp.value = false;
    return;
  }
  showStamp.value = true;
};

const isPrintMode = ref(false);
// 进入打印模式
const enterPrintMode = () => {
  isPrintMode.value = true;
  // 新增：通知父组件需要隐藏导航栏
  emit("toggle-nav", false);
  // 生成excel物料表
  if (!tableData.value || tableData.value.length === 0) {
    ElMessage.warning("表格中没有数据，无法导出！");
    return;
  }

  // 构建导出数据（仅导出需要的字段）
  const exportData = tableData.value.map((row) => {
    return {
      产品编码: row.PartNumber,
      产品描述:
        currentLanguage.value === "zh"
          ? row.chinese_short_descript || row.ShortDescription
          : row.ShortDescription || row.chinese_short_descript,
      单价: Number(getPriceType(row)), // 纯数值（用于计算）
      数量: row.quantity,
      金额: Number(row.lineAmount), // 纯数值
      金额单位: getCurrencySymbol(), // 新增字段：金额货币符号
    };
  });

  // 将数据转为工作表
  const ws = XLSX.utils.json_to_sheet(exportData);

  // 创建工作簿并写入数据
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "关联物料单");

  // 生成 Excel 文件并下载
  XLSX.writeFile(wb, `关联物料单_Q${quoteNumber.value}.xlsx`);
  ElMessage.success("物料表已生成！");
  // 调用打印PDF
  generatePDF();
};
// 打印pdf
const generatePDF = async () => {
  try {
    // 选择需要导出的 DOM 元素
    const element = document.querySelector(".container");
    if (!element) {
      ElMessage.error("未找到导出区域");
      return;
    }
    // 内部执行顺序问题，必须添加一点延迟，让PDF的图片加载出来
    await new Promise((r) => setTimeout(r, 1));
    // 获取元素的实际宽高
    const elementWidth = element.offsetWidth; // 元素宽度
    const elementHeight = element.offsetHeight; // 元素高度
    // 将宽高转换为毫米（1px ≈ 0.264583mm）
    const pdfWidth = elementWidth * 0.264583;
    const pdfHeight = elementHeight * 0.264583;

    // 配置 PDF 生成选项
    const options = {
      margin: 1, // 边距
      filename: document.title, // 文件名
      image: { type: "jpeg", quality: 1.0 }, // 图片质量
      html2canvas: {
        scale: 2, // 提高清晰度
        useCORS: true, // 允许跨域加载图片
        allowTaint: false, // 禁止污染画布
        logging: false, // 禁用日志
        width: elementWidth, // 确保宽度一致
        height: elementHeight, // 确保高度一致
      },
      jsPDF: {
        unit: "mm",
        format: [pdfWidth, pdfHeight], // 动态设置 PDF 尺寸
        orientation: "portrait",
      },
      pagebreak: { mode: ["css", "legacy"] },
    };

    // 生成 PDF 并下载
    await html2pdf().set(options).from(element).toPdf().get("pdf").save();
    ElMessage.success("PDF生成成功！请检查下载的文件并打开查看");
  } catch (error) {
    console.error("PDF生成失败:", error);
    ElMessage.error("PDF生成失败，请检查控制台日志");
  }
};
// 退出打印模式
const exitPrintMode = () => {
  isPrintMode.value = false;
  // 新增：通知父组件需要显示导航栏
  emit("toggle-nav", true);
};

// 新增响应式变量：控制客户信息显示
const showCustomerInfo = ref(false);

// 新增方法：切换客户信息显示状态
const toggleCustomerInfo = () => {
  showCustomerInfo.value = !showCustomerInfo.value;
};

// 客户资料字段配置
const customerFields = {
  name: { label: "客户名称" },
  contact: { label: "联系人" },
  phone: { label: "联系方式" },
  remark: { label: "备注" },
  address: { label: "地址" },
};

const handleCancelAddCustomItem = () => {
  addCustomItemDialogVisible.value = false;
  customItemFormRef.value.resetFields(); // 重置表单校验
  // 清空表单数据
  newCustomItem.PartNumber = "";
  newCustomItem.ShortDescription = "";
  newCustomItem.Description = null;
  newCustomItem.quantity = 1;
  newCustomItem.RRP = null;
  newCustomItem.RRP113 = null;
  newCustomItem.Wholesaler = null;
  newCustomItem.Distributor = null;
  newCustomItem.OEM = null;
  newCustomItem.Dealer = null; // 新增的含税价格
  newCustomItem.Retail = null;
};
// --------- 批量添加，逻辑相关 ---------
const batchDialogVisible = ref(false);
const batchInput = ref("");
const batchFileRef = ref(null);
const batchNotFound = ref([]);
const batchSkipExisting = ref(true);
const openBatchDialog = () => {
  batchNotFound.value = [];
  batchInput.value = "";
  batchDialogVisible.value = true;
  if (batchFileRef.value) batchFileRef.value.value = "";
};

const parsePartNumbersFromText = (text) => {
  // 每行一条，支持 "PN" 或 "PN,数量"
  const lines = String(text || "")
    .split(/\r\n|\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((l) => {
    const parts = l.split(/[,，\t]/).map((p) => p.trim());
    return { part: parts[0], qty: Number(parts[1]) || 1 };
  });
};

const processBatchList = (items) => {
  batchNotFound.value = [];
  const added = [];
  items.forEach(({ part, qty }) => {
    const code = String(part || "").trim();
    if (!code) return;
    const exists = originalTableData.value.some(
      (it) => String(it.PartNumber).trim() === code
    );
    if (exists && batchSkipExisting.value) return;
    const product = allProducts.value.find(
      (p) => String(p.PartNumber).trim() === code
    );
    if (product) {
      const newRow = {
        ...product,
        productType: ProductRange.value,
        quantity: qty || 1,
        customPrice: null,
        RRP: product.rawRRP,
        RRP113: product.rawRRP113,
        Wholesaler: product.rawWholesaler,
        Distributor: product.rawDistributor,
        OEM: product.rawOEM,
        Dealer: product.rawDealer,
        Retail: product.rawRetail,
        imageUrl: `/NavicoImg/${product.PartNumber}.png`,
        uuid: uuidv4(),
      };
      originalTableData.value.push(newRow);
      added.push(code);
    } else {
      batchNotFound.value.push(code);
    }
  });
  if (added.length) {
    dataProcessMethods();
    ElMessage.success(
      `已添加 ${added.length} 项，未找到 ${batchNotFound.value.length} 项`
    );
  } else {
    if (batchNotFound.value.length)
      ElMessage.warning(`未找到 ${batchNotFound.value.length} 项`);
    else ElMessage.info("没有新项被添加");
  }
};

const processBatch = () => {
  const text = String(batchInput.value || "").trim();
  if (text) {
    const list = parsePartNumbersFromText(text);
    processBatchList(list);
    return;
  }
  ElMessage.info("请粘贴编码或上传文件后再点开始");
};
// element-upload 的 before-upload 钩子/上传处理
const handleBatchBeforeUpload = async (file) => {
  try {
    // 复用已有解析函数 onBatchFileChange（它期望一个 event-like 对象）
    await onBatchFileChange({ target: { files: [file] } });
  } catch (err) {
    console.error("handleBatchBeforeUpload 处理失败", err);
    ElMessage.error("文件解析失败，请检查文件格式");
  }
  // 返回 false 阻止 el-upload 执行默认的上传请求
  return false;
};
// 将上传的excel直接处理为表单数据
const onBatchFileChange = async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (ext === "csv") {
      const text = await file.text();
      const rows = text
        .split(/\r\n|\n/)
        .map((r) => r.split(","))
        .filter((r) => r && r[0])
        .map((r) => ({ part: String(r[0]).trim(), qty: Number(r[1]) || 1 }));
      processBatchList(rows);
    } else {
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      // 标题行，所以第一行会被扔掉
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // 找第一列为编码，第二列为数量（可选）
      const rows = data
        .slice(1)
        .map((r) => ({
          part: r[0] ? String(r[0]).trim() : "",
          qty: Number(r[1]) || 1,
        }))
        .filter((r) => r.part);
      processBatchList(rows);
    }
  } catch (err) {
    console.error("批量文件解析失败", err);
    ElMessage.error("文件解析失败，请检查格式");
  } finally {
    if (batchFileRef.value) batchFileRef.value.value = "";
  }
};
// 新增语言切换相关逻辑
const currentLanguage = ref("zh"); // 默认为中文
const toggleLanguage = () => {
  if (currentLanguage.value === "zh") {
    currentLanguage.value = "en";
  } else {
    currentLanguage.value = "zh";
  }
};
// 新增银行切换相关逻辑
const currentbank = ref("continent"); // 默认为中文
const togglebank = () => {
  if (currentbank.value === "continent") {
    currentbank.value = "hongkong";
  } else {
    currentbank.value = "continent";
  }
};
// 切换产品数据范围的动作
const ProductRangeChange = () => {
  // 清空当前选中商品（触发搜索框重置）
  selectedProduct.value = null;
  // 强制清空过滤后的商品列表
  filteredProducts.value = [];
};

// 监听美元汇率变化
watch(rateUSD, (newVal) => {
  // console.log("tableData.value:", tableData.value);
  // transformTableData();
  if (selectedCurrency.value === "USD") {
    exchangeRate.value = Number(newVal);
  }
  dataProcessMethods(); //  处理数据

  // console.log("tableData.value:", tableData.value);
});
// 监听欧元汇率变化
watch(rateEUR, (newVal) => {
  if (selectedCurrency.value === "EUR") {
    exchangeRate.value = Number(newVal);
    dataProcessMethods(); //  处理数据
  }
});
// 监听客户类型变化
watch(selectedCustomerType, (newVal) => {
  console.log("newVal:", tableData.value);
});
// 拖拽功能的相关实现！！！！
const sortInstance = ref(null);
// 拖拽事件
const initSort = () => {
  const table = document.querySelector(
    ".el-table .el-table__body-wrapper tbody"
  );
  if (!table) return;
  sortInstance.value = new Sortable(table, {
    group: "shared",
    handle: ".drag-handle",
    animation: 150,
    ghostClass: "sortable-ghost", //拖拽样式
    forceFallback: true,
    fallbackOnBody: true,
    easing: "cubic-bezier(1, 0, 0, 1)",
    draggable: ".el-table__row", // 结束拖动事件
    onEnd: (evt) => {
      const oldIdx = evt.oldIndex;
      const newIdx = evt.newIndex;
      if (oldIdx == null || newIdx == null || oldIdx === newIdx) return;
      // 直接在 originalTableData 上重排
      const arr = originalTableData.value;
      const moved = arr.splice(oldIdx, 1)[0];
      arr.splice(newIdx, 0, moved);
      // 重新处理数据并刷新显示
      dataProcessMethods();
    },
  });
};
</script>

<style scoped>
.ellipsis {
  white-space: nowrap !important; /* 文本不换行 */
  overflow: hidden !important; /* 溢出内容隐藏 */
  text-overflow: ellipsis !important; /* 溢出显示省略号 */
  width: 400px !important;
  width: 100%;
  max-width: 480px;
}

.other-fee {
  margin-top: 10px;
}

.select {
  height: 800px !important;
}
.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* 基础容器调整 */
.container {
  max-width: 1300px;
  margin: 0 auto;
  padding-left: 18px;
  background: #ffffff;
}

/* 头部样式优化 */
.header {
  text-align: center;
  border-bottom: 2px solid #1c3f94;
  /* padding: 12px 0; */
  background-color: #fff;
  position: relative;
  overflow: hidden;
}
.logo {
  position: absolute; /* 绝对定位 */
  top: 10px; /* 距顶部 10px */
  left: 10px; /* 距左侧 10px */
  width: 200px; /* 适中尺寸（可按需调整） */
  height: auto; /* 高度自适应，保持比例 */
  z-index: 2; /* 可选：确保图片在文字之上 */
}

.header h1,
.header p,
.header h2 {
  position: relative;
  z-index: 1;
  color: #000000;
}
.title1 {
  text-align: center;
}

.header h1 {
  font-size: 48px;
  font-weight: bold;
  margin-left: 10%;
}

.header p {
  font-size: 24px;
  margin: 0;
}

.header h2 {
  font-size: 36px;
  font-weight: 500;
  margin: 0;
}
.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 创建两列等宽布局 */
  /* grid-gap: 12px 24px;  */
  /* padding: 16px; */
  background-color: #f8f9fa;
  margin-top: 32px;
}
.rate-grid {
  width: 150px;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 2px 0;
  font-size: 12px;
}
.rate-text {
  font-size: 16px !important;
}

.grid-item {
  display: flex;
  padding: 0px 12px;
  background-color: #ffffff;
  color: #000000;
  font-weight: 600;
}
.contact-grid-eng {
  margin-top: 32px;
}
.grid-item-eng {
  text-align: left;
}
.grid-item-eng-s {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列，每列等宽 */
  gap: 10px; /* 可选：设置列间距 */
}

.grid-item-eng-s span {
  white-space: nowrap; /* 防止换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出显示省略号 */
  padding: 0; /* 可选：增加内边距提升可读性 */
  text-align: left;
}

/* 主容器布局优化 */
.main-container {
  /* margin-top: 8px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: #fff;
}

.search-customer-container {
  /* padding: 16px 20px; */
  background: #fff;
}

.left-section {
  display: flex;
  align-items: center;
}

.left-section span {
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.left-title {
  font-weight: 600;
  color: #000000;
  min-width: 180px;
  align-items: center;
}

.left-title::after {
  content: "|"; /* 添加分隔符 */
  margin-right: 10px; /* 控制分隔符与右侧内容的间距 */
  padding-bottom: 3px;
  opacity: 0.8;
  color: #ff0000; /* 设置分隔符颜色 */
  font-size: 30px; /* 设置分隔符字体大小 */
}
.Currency-text {
  font-weight: 600;
  color: #000000;
  min-width: 180px;
}

/* 搜索框样式优化 */
.search-section {
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 650px;
  position: sticky;
  top: 65px;
  z-index: 100;
  margin-left: auto; /* 让它靠右 */
  background: #f5f8ff; /* 柔和底色 */
  border-radius: 14px;
  box-shadow: 0 4px 18px 0 rgba(60, 120, 240, 0.08),
    0 1.5px 6px 0 rgba(0, 0, 0, 0.04);
  border: 1.5px solid #e3e8f7;
  padding: 14px 24px 14px 18px;
  transition: box-shadow 0.2s;
}
.search-section:focus-within {
  box-shadow: 0 6px 24px 0 rgba(60, 120, 240, 0.16),
    0 2px 8px 0 rgba(0, 0, 0, 0.08);
  border-color: #a3bfff;
}
.search-label {
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
  margin-right: 12px;
}

.search-box {
  flex: 1;
  min-width: 300px;
}
.range-box {
  flex: 1;
  min-width: 150px;
}

/* 表格样式优化 */
.el-table {
  overflow: hidden;
}

.el-table th {
  background: #f5f7fa;
  color: #000000;
  font-weight: 600;
}

.el-table td {
  transition: background-color 0.3s;
}

.el-table tr:hover td {
  background-color: #f5f7fa !important;
}

/* 按钮样式优化 */
.el-button {
  transition: all 0.3s;
  /* font-size: 17px; */
}

.el-button--primary {
  background: #409eff;
  border-color: #409eff;
}

.el-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.el-button--danger {
  background: #f56c6c;
  border-color: #f56c6c;
}

.el-button--danger:hover {
  background: #f78989;
  border-color: #f78989;
}

/* 新增项按钮 */
.NewItemButton {
  display: flex;
  justify-content: flex-end;
}

.NewItemButton .el-button {
  /* padding: 12px 24px; */
  border-radius: 4px;
  margin: 8px;
  color: #000000;
}

.NewItemButton .el-button:hover {
  background: #fff;
  border-color: #000000;
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}
.batch-add-button {
  background: #165dff;
  color: #fff !important;
}
.batch-add-button:hover {
  background: #165dff !important;
  color: #fff !important;
}
/* 总计样式 */
.summary-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  margin-top: 12px;
  padding: 12px 16px;
  background: linear-gradient(180deg, #fafafa, #ffffff);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  color: #303133;
}

.summary-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.summary-cell .label {
  color: #606266;
}

.summary-cell .value {
  font-weight: 600;
}

.summary-cell .amount {
  color: #409eff; /* Element Plus 主色 */
}
.summary-cell:last-child {
  justify-content: flex-end;
}
.table-container {
  background: linear-gradient(145deg, #ffffff, #f0f0f0); /* 渐变背景色 */
  padding: 0 12px;
}
/* 页脚优化 */
.footer {
  border-top: 1px solid #1c3f94;
  padding: 25px 0;
  background: #fff;
  text-align: center; /* 居中对齐 */
  font-weight: 600;
}
.footer-text {
  display: flex;
  align-items: flex-start; /* 顶部对齐 */
  gap: 8px; /* 两个盒子间距 */
}

.footer-text-explanation p {
  margin: 8px 0;
  color: #000000;
  font-size: 20px;
  line-height: 1.6;
  text-align: left;
  margin-left: 20px;
}

.footer img {
  max-width: 180px;
  margin-top: 15px; /* Logo 图片与说明文字之间增加间距 */
}
.bank-information-coninent p {
  margin: 8px 100px;
  text-align: left;
  font-size: 20px;
  line-height: 1.5;
}
.bank-information-hongkong p {
  margin: 8px 30px;
  text-align: left;
  font-size: 20px;
  line-height: 1.65;
}

/* 弹窗样式优化 */
.el-dialog {
  border-radius: 8px !important;
}

.el-dialog__header {
  border-bottom: 1px solid #eee;
}

.el-form-item__label {
  color: #606266;
  font-weight: 500;
}

/* 选项样式优化 */
.option {
  padding: 0px 16px;
}

.option-box {
  height: auto;
  padding: 8px 0;
}

/* 客户资料盒子样式优化 */
.customer-info {
  /* padding: 0 20px; */
  background: #fff;
  border-radius: 8px;
}

.customer-info h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

/* 修改地址字段样式，使其占满两列 */
.info-item.address {
  grid-column: span 2;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  width: 100px;
  font-size: 14px;
  color: #606266;
  text-align: right;
  margin-right: 10px;
  white-space: nowrap;
}

.info-input {
  flex: 1;
  min-width: 200px;
}
.delivery-text {
  font-size: large;
}
/* 这一部分是对table的原始样式进行修改，需要注意间隔开来 */
.info-item {
  padding: 0 5px; /* 统一左右间距 */
}

/* 修改 .stamp-button 样式，确保其为橙色主题 */
.stamp-button {
  background: #e67e22 !important; /* 橙色背景 */
  border-color: #e67e22 !important;
  color: #fff !important;
  margin-left: 10px;
  padding: 8px 16px; /* 增加内边距，提升按钮视觉效果 */
  border-radius: 4px; /* 圆角边框 */
}

.stamp-button:hover {
  background: #d35400 !important; /* 悬停时更深的橙色 */
  border-color: #d35400 !important;
  color: #fff !important;
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

/* 确保 .print-mode-button 的蓝色主题不被覆盖 */
.print-mode-button {
  background: #3498db !important; /* 蓝色背景 */
  border-color: #3498db !important;
  color: #fff !important;
  margin-left: 10px;
  padding: 8px 16px; /* 增加内边距，提升按钮视觉效果 */
  border-radius: 4px; /* 圆角边框 */
}

.print-mode-button:hover {
  background: #2980b9 !important; /* 悬停时更深的蓝色 */
  border-color: #2980b9 !important;
  color: #fff !important;
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

/* 新增样式：显示/隐藏客户信息按钮 */
.toggle-customer-info-button {
  background: #2ecc71 !important; /* 绿色背景 */
  border-color: #2ecc71 !important;
  color: #fff !important;
  margin-left: 10px;
  padding: 8px 16px; /* 增加内边距，提升按钮视觉效果 */
  border-radius: 4px; /* 圆角边框 */
}

.toggle-customer-info-button:hover {
  background: #27ae60 !important; /* 悬停时更深的绿色 */
  border-color: #27ae60 !important;
  color: #fff !important;
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}
:deep(.custom-input-number .el-input__wrapper) {
  padding: 0 !important;
}
:deep(.custom-input-number .el-input__inner) {
  padding: 0px 5px !important;
}
/* 新增样式：切换语言按钮 */
.language-switch-button {
  background: #9b59b6 !important; /* 紫色背景 */
  border-color: #9b59b6 !important;
  color: #fff !important;
  margin-left: 10px;
  padding: 8px 16px; /* 增加内边距，提升按钮视觉效果 */
  border-radius: 4px; /* 圆角边框 */
}

.language-switch-button:hover {
  background: #8e44ad !important; /* 悬停时更深的紫色 */
  border-color: #8e44ad !important;
  color: #fff !important;
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}
/* 新增样式：切换银行按钮 */
.bank-switch-button {
  background: #165dff !important; /* 紫色背景 */
  border-color: #165dff !important;
  color: #fff !important;
  margin-left: 10px;
  padding: 8px 16px; /* 增加内边距，提升按钮视觉效果 */
  border-radius: 4px; /* 圆角边框 */
}

.bank-switch-button:hover {
  background: #165dff !important; /* 悬停时更深的紫色 */
  border-color: #165dff !important;
  color: #fff !important;
}
.el-table {
  color: #000000;
  font-size: 16px;
}
:deep(.el-input__inner) {
  color: #000000 !important;
  caret-color: #000000 !important; /* 输入光标颜色 */
}
:deep(.el-table) {
  padding-top: 0;
  padding-bottom: 0;
}
:deep(.el-table__cell) {
  padding-top: 6px;
  padding-bottom: 0;
}
:deep(.cell) {
  padding-left: 0;
  padding-right: 8px;
}
.product-image {
  display: block; /* 确保图片是块级元素 */
  max-width: 100%; /* 限制图片宽度不超过容器 */
  max-height: 100%; /* 限制图片高度不超过容器 */
  width: auto; /* 自动调整宽度 */
  height: auto; /* 自动调整高度 */
  object-fit: contain; /* 保持图片比例，适配容器 */
}
/* 添加样式 */
.image-slot {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-box-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
