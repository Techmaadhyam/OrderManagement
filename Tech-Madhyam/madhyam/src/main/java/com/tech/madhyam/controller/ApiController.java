package com.tech.madhyam.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tech.madhyam.entity.AppObject;
import com.tech.madhyam.entity.AppObjectField;
import com.tech.madhyam.entity.AppUser;
//import com.google.gson.Gson;
//import com.google.gson.GsonBuilder;
import com.tech.madhyam.entity.Approvers;
import com.tech.madhyam.entity.Category;
import com.tech.madhyam.entity.Company;
import com.tech.madhyam.entity.Document;
import com.tech.madhyam.entity.Inventory;
import com.tech.madhyam.entity.NonUser;
import com.tech.madhyam.entity.Product;
import com.tech.madhyam.entity.Profile;
import com.tech.madhyam.entity.PurchaseOrder;
import com.tech.madhyam.entity.PurchaseOrderDetails;
import com.tech.madhyam.entity.Quotation;
import com.tech.madhyam.entity.QuotationDetails;
import com.tech.madhyam.entity.Rack;
import com.tech.madhyam.entity.SalesOrder;
import com.tech.madhyam.entity.SalesOrderDetails;
import com.tech.madhyam.entity.Schema;
import com.tech.madhyam.entity.SchemaRecord;
import com.tech.madhyam.entity.SchemaRecordFieldValue;
import com.tech.madhyam.entity.User;
import com.tech.madhyam.entity.Warehouse;
import com.tech.madhyam.entity.WorkOrder;
import com.tech.madhyam.entity.WorkOrderItems;
import com.tech.madhyam.repository.AppObjectFieldRespository;
import com.tech.madhyam.repository.AppObjectRepository;
import com.tech.madhyam.repository.AppUserRespository;
import com.tech.madhyam.repository.ApproverRepository;
import com.tech.madhyam.repository.CategoryRepository;
import com.tech.madhyam.repository.CompanyRepository;
import com.tech.madhyam.repository.DocumentRepository;
import com.tech.madhyam.repository.InventoryRepository;
import com.tech.madhyam.repository.NonUserRepository;
import com.tech.madhyam.repository.ProductRepository;
import com.tech.madhyam.repository.ProfileRepository;
import com.tech.madhyam.repository.PurchaseOrderDetailsRepository;
import com.tech.madhyam.repository.PurchaseOrderRepository;
import com.tech.madhyam.repository.QuotationDetailsRepository;
import com.tech.madhyam.repository.QuotationRepository;
import com.tech.madhyam.repository.RackRepository;
import com.tech.madhyam.repository.SalesOrderDetailsRepository;
import com.tech.madhyam.repository.SalesOrderRepository;
import com.tech.madhyam.repository.SchemaRecordFieldValueRepository;
import com.tech.madhyam.repository.SchemaRecordRepository;
import com.tech.madhyam.repository.SchemaRepository;
import com.tech.madhyam.repository.WarehouseRepository;
import com.tech.madhyam.repository.WorkOrderItemsRepository;
import com.tech.madhyam.repository.WorkOrderRepository;
import com.tech.madhyam.repository.UserRepository;

//import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.JsonComponentModule;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 5600)
@RequestMapping("/techmadhyam")
public class ApiController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    ProductRepository itemRepository;
    @Autowired
    WarehouseRepository warehouseRepository;    
    @Autowired
    InventoryRepository inventoryRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    NonUserRepository nonUserRepository;
    @Autowired
    PurchaseOrderRepository purchaseOrderRepository;
    @Autowired
    SalesOrderRepository salesOrderRepository;  
    @Autowired    
    QuotationRepository quotationRepository;
    @Autowired    
    QuotationDetailsRepository quotationDetailRepository;    
    @Autowired
    PurchaseOrderDetailsRepository purchaseOrderDetailsRepository;
    @Autowired
    SalesOrderDetailsRepository salesOrderDetailsRepository;
    @Autowired
    RackRepository rackRepository;    
    @Autowired
    DocumentRepository documentRepository;  
    @Autowired
    ApproverRepository approverRepository;  
    @Autowired
    WorkOrderRepository workOrderRepository;
    @Autowired
    WorkOrderItemsRepository workOrderItemsRepository;
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    ProfileRepository profileRepository;
    @Autowired    
    AppUserRespository appUserRespository;
    @Autowired
    AppObjectRepository appObjectRepository;
    @Autowired
    AppObjectFieldRespository appObjectFieldRespository;
    @Autowired
    SchemaRepository schemaRepository;
    @Autowired
    SchemaRecordRepository schemaRecordRepository;
    @Autowired
    SchemaRecordFieldValueRepository schemaRecordFieldValueRepository;

    @GetMapping("/hello")
    public String hello(){
        return "Hello, I am from madhyam!!!";
    }

    /* *** Product related API start  */
    @GetMapping("/getAllItem/{userId}")
    public List<Product> getAllItem(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        List<Product> items =  itemRepository.getProductByUserId(userId, companyName);
        return items;
    }

    /* *** get all Customer*/
    @GetMapping("/getAllUsersByCustomer")
    public List<User> getAllUsersByCustomer(){
        return userRepository.getAllUsersByCustomer();
    }  

    /* *** get all Super User*/
    @GetMapping("/getAllSuperUser")
    public List<User> getAllSuperUser(){
        return userRepository.getAllSuperUser();
    }     
    
    /* *** get user logo*/
    @GetMapping("/getUserLogo/{id}")
    public List<Document> getUserLogo(@PathVariable long id){
        return documentRepository.getLogoByLoginUser(id, "companylogo");
    }

    @GetMapping("/getProductById/{id}")
    public Product getItemById(@PathVariable long id){
        return itemRepository.findById(id).get();
    }

    @PostMapping("/addProduct")
    public Product addItem(@RequestBody String wrapper) throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(wrapper);
        Product prodRec = mapper.readValue(mJsonObject.get("product").toString(), Product.class);
        Category category = mapper.readValue(mJsonObject.get("category").toString(), Category.class);
        System.out.println("prodRec-----"+prodRec);
        User userRec = userRepository.findById(prodRec.getCreatedBy()).get();        
        prodRec.createdByUser = userRec;
        System.out.println("category-----"+category);
        System.out.println("category.Id()-----"+category.id);
        if(category.id == 0){
            Category categoryRec = mapper.readValue(mJsonObject.get("category").toString(), Category.class);
            categoryRec.createdByUser = userRec;
            Category saveRecord = categoryRepository.save(categoryRec); 
            System.out.println("saveRecord-----"+saveRecord);
            Product prod = prodRec;
            //System.out.println("check-----"+categoryRec.name);
            prod.category = saveRecord;
            //prod.category = saveRecord;
            return itemRepository.save(prod);
        }else{
            prodRec.category = categoryRepository.findById(category.id).get();
            Product prod = itemRepository.save(prodRec);
            return prod;
        }
    }

    public class ProductCategoryWrap{
        public Product product;
        public Category category;
    }

    @DeleteMapping("/deleteItemById/{id}")
    public void deleteItemById(@PathVariable long id){
        itemRepository.deleteById(id);
    }

   /*@PostMapping("/updateProduct")
    public Product updateItem(@RequestBody Product item){
        Product prod = itemRepository.findById(item.getid());
        return itemRepository.save(item);
    }*/

    /* *** Product related API start  */

     /* Category CRUD */

     @DeleteMapping("/deleteQuotationId/{id}")
     public void deleteQuotationId(@PathVariable long id){
        List<QuotationDetails> quotationDetails = quotationDetailRepository.getAllQuotationDetails(id);
        if(quotationDetails != null && !quotationDetails.isEmpty()){
            quotationDetailRepository.deleteAll(quotationDetails);
        }
        quotationRepository.deleteById(id);
     }     

     @PostMapping("/addQuoatation")
     public QuotationDetailWrapper addQuoatation(@RequestBody String quotationWrap)throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(quotationWrap);
        QuotationDetails[] quotationDetails = mapper.readValue(mJsonObject.get("quotationDetails").toString(), QuotationDetails[].class);
        Quotation quotation = mapper.readValue(mJsonObject.get("quotation").toString(), Quotation.class);        
        User userRec = userRepository.findById(quotation.getCreatedBy()).get();        
        quotation.createdByUser = userRec;        
        Quotation quotationSaveRecord = quotationRepository.save(quotation);
        List<QuotationDetails> quotationDetailList = new ArrayList<QuotationDetails>();
        for(QuotationDetails rec: quotationDetails){
            rec.quotationId = quotationSaveRecord;
            quotationDetailList.add(rec);
        }         
        QuotationDetailWrapper wrap = new QuotationDetailWrapper();
        wrap.quotation = quotationSaveRecord;
        wrap.quotationDetails = quotationDetailRepository.saveAll(quotationDetailList);
        System.out.println("wrap-----"+wrap);
        if(mJsonObject.has("deletedQuotationDetails")){
            QuotationDetails[] deletedQuotationDetails = mapper.readValue(mJsonObject.get("deletedQuotationDetails").toString(), QuotationDetails[].class);
            if(deletedQuotationDetails.length != 0){
                List<QuotationDetails> deletedQuotationList = Arrays.asList(deletedQuotationDetails);
                quotationDetailRepository.deleteAll(deletedQuotationList);
            }
        } 
        return wrap;
    }

    public class QuotationDetailWrapper{
        public List<QuotationDetails> quotationDetails;
        public Quotation quotation;
    }

    @GetMapping("/getAllQuotations/{userId}")
    public List<Quotation> getAllQuotationsByUserId(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();        
        return quotationRepository.getAllQuotationsByUserId(userId, companyName);
    }  
    

    @GetMapping("/getAllQuotationDetails/{quotationId}")
    public List<QuotationDetails> getAllQuotationDetails(@PathVariable long quotationId){
        List<QuotationDetails> quotationDetails = quotationDetailRepository.getAllQuotationDetails(quotationId);
        return quotationDetails;
        /*JSONArray array =  new JSONArray();
        for(QuotationDetails details: quotationDetails){
            JSONObject object = new JSONObject();
            //if(details.getProductId() > 0){
            Gson gson = new GsonBuilder().disableHtmlEscaping().create();
            String inventoryBody = gson.toJson(details.getInventory());
            object.put("inventory", inventoryBody);

            gson = new GsonBuilder().disableHtmlEscaping().create();
            String productBody = gson.toJson(details.getProduct());  
            object.put("product",productBody);                
            object.put("id",details.getId());
            object.put("quantity",details.getQuantity());
            object.put("size", details.getSize());
            object.put("weight", details.getWeight());
            object.put("price", details.getPrice());
            object.put("sgst", details.getSGST());
            object.put("cgst", details.getCGST());
            object.put("igst", details.getIGST());;
            object.put("workstationCount", details.getWorkstationCount());
            object.put("description", details.getDescription());  
            array.put(object);          
        }
        return array.toString();*/
    }      

    /* Category CRUD */
    @PostMapping("/addCategory")
    public Category addCategory(@RequestBody Category category){          
        return categoryRepository.save(category);
    }

    @PutMapping("/updCategory")
    public Category updCategory(@RequestBody Category category){          
        return categoryRepository.save(category);
    }    

    @GetMapping("/getAllCategorys/{userId}")
    public List<Category> getAllCategorys(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();             
        return categoryRepository.getCategoryByUserId(userId, companyName);
    }    
    /* Category CRUD */   

    /* WAREHOUSE USER CRUD */

    @GetMapping("/getAllWareHouse/{userId}")
    public List<Warehouse> getAllWareHouse(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();        
        List<Warehouse> warehouses =  warehouseRepository.getWareHousesByUserId(userId, companyName);
        return warehouses;
        /*JSONArray array =  new JSONArray();
        for (Warehouse item : warehouses){
            JSONObject object = new JSONObject();
            object.put("id",item.getId());
            object.put("name",item.getName());
            object.put("contactName", item.getContactName());
            object.put("mobile", item.getMobile());
            object.put("address", item.getAddress());
            object.put("city", item.getCity());
            object.put("state", item.getState());
            object.put("country", item.getCountry());
            object.put("zipcode", item.getZipcode());
            object.put("description", item.getDescription());
            array.put(object);
        }
        return array.toString();*/
    }

    @GetMapping("/getWareHouseById/{id}")
    public Warehouse getWareHouseById(@PathVariable long id){
        return warehouseRepository.findById(id).get();
    }

    @PostMapping("/addWareHouse")
    public Warehouse addWareHouse(@RequestBody Warehouse warehouse){
        User userRec = userRepository.findById(warehouse.getCreatedBy()).get();        
        warehouse.createdByUser = userRec;         
        return warehouseRepository.save(warehouse);
    }

    @DeleteMapping("/deleteWareHouseById/{id}")
    public void deleteWareHouseById(@PathVariable long id){
        warehouseRepository.deleteById(id);
    }
    /* WAREHOUSE USER CRUD */

    /* TEMP USER CRUD */
    @GetMapping("/getAllTempUsers/{userId}")
    public List<NonUser> getAllTempUsers(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();            
        return nonUserRepository.getNonTempByUserId(userId, companyName);
    }

    @GetMapping("/getTempUserById/{id}")
    public NonUser getTempUserById(@PathVariable long id){
        return nonUserRepository.findById(id).get();
    }

    @GetMapping("/getAllUsersBasedOnType/{id}")
    public List<User> getAllUsers(@PathVariable long id){
        User userRec = userRepository.findById(id).get();
        return userRepository.findByType(userRec.getType(), id);
    }
    
    @GetMapping("/getAllUsersByType/{id}/{type}")
    public List<User> getAllUsersByType(@PathVariable long id, @PathVariable String type){
        return userRepository.findByType(type, id);
    }     

    @PostMapping("/addTempUser")
    public NonUser addTempUser(@RequestBody NonUser user){
        //User userRec = userRepository.findById(user.getCreatedBy()).get();        
        //user.createdByUser = userRec;         
        return nonUserRepository.save(user);
    }

    @DeleteMapping("/deleteTempUserId/{id}")
    public void deleteTempUserId(@PathVariable long id){
        nonUserRepository.deleteById(id);
    }  
    /* TEMP USER CRUD */

    /* *** Item related API End  */

    /* *** Inventory related API start  */

    @GetMapping("/getAllInventory")
    public List<Inventory> getALlInventory(){
        return inventoryRepository.findAll();
    }

    /* *** Inventory related API end  */

    /* *** User related API start  */
    @GetMapping("/getUserById/{id}")
    public User getUserById(@PathVariable long id){
        return userRepository.findById(id).get();
    }

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user){
        return userRepository.save(user);
    }


    @DeleteMapping("/deleteUserById/{id}")
    public void deleteUserById(@PathVariable long id){
        userRepository.deleteById(id);
    }

    @GetMapping("/getUserByUsername/{userName}")
    public Object getUserByUsernameUser(@PathVariable String userName){
        List<User> userList = userRepository.getUserByUserName(userName);
        LoggedInUserWrapper wrap = new LoggedInUserWrapper();
        wrap.loggedIUser = userList;
        if(userList.size() > 0){
            wrap.documents = documentRepository.getLogoByLoginUser(userList.get(0).getId(), "companylogo");
        }
        return wrap;
    }

    public class LoggedInUserWrapper{
        public List<User> loggedIUser;
        public List<Document> documents;
    }
  
    @DeleteMapping("/deletePurchaseOrderId/{id}")
    public void deletePurchaseOrderId(@PathVariable long id){
        List<PurchaseOrderDetails> poDetails = purchaseOrderDetailsRepository.getPurchaseOrderDetails(id);
        if(poDetails != null && !poDetails.isEmpty()){
            purchaseOrderDetailsRepository.deleteAll(poDetails);
        }
        purchaseOrderRepository.deleteById(id);
    } 

    /* FETCH ALL PURCHASE ORDER */
    @GetMapping("/getAllPurchaseOrderByUser/{userId}")
    public List<PurchaseOrder> getAllPurchaseOrderByUser(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();         
        return purchaseOrderRepository.getPurchaseOrderByUser(userId, companyName);
    }  
    /* FETCH ALL PURCHASE ORDER */

     /* FETCH ALL PURCHASE ORDER DETAILS*/
    @GetMapping("/getAllPurchaseOrderDetails/{purchaseOrderId}")
    public  List<PurchaseOrderDetails> getAllPurchaseOrderDetails(@PathVariable long purchaseOrderId){
        List<PurchaseOrderDetails> poDetails = purchaseOrderDetailsRepository.getPurchaseOrderDetails(purchaseOrderId);
        return poDetails;
        /*JSONArray array =  new JSONArray();
        for(PurchaseOrderDetails details: poDetails){
            JSONObject object = new JSONObject();
            Gson gson = new GsonBuilder().disableHtmlEscaping().create();
            String productBody = gson.toJson(details.getProduct());  
            object.put("product",productBody); 
            object.put("id",details.getId());
            object.put("quantity",details.getQuantity());
            object.put("size", details.getSize());
            object.put("weight", details.getWeight());
            object.put("price", details.getPrice());
            object.put("sgst", details.getSgst());
            object.put("cgst", details.getCgst());
            object.put("igst", details.getIgst());
            object.put("description", details.getDescription());  
            array.put(object);          
        }
        return array.toString();*/
    }
     /* FETCH ALL PURCHASE ORDER DETAILS*/

     /* FETCH ALL SALES ORDER*/
    @GetMapping("/getAllSalesOrderDetailByUser/{userId}")
    public List<SalesOrder> getAllSalesOrderDetailByUser(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();        
        return salesOrderRepository.getAllSalesOrderDetailByUser(userId, companyName);
    } 

    @DeleteMapping("/deleteSalesOrderId/{id}")
    public void deleteSalesOrderId(@PathVariable long id){
        List<SalesOrderDetails> soDetails = salesOrderDetailsRepository.getAllSalesOrderDetails(id);
        if(soDetails !=null && !soDetails.isEmpty()){
            salesOrderDetailsRepository.deleteAll(soDetails);
        }
        salesOrderRepository.deleteById(id);
    } 

     /* FETCH ALL SALES ORDER*/ 
    
     /* FETCH ALL SALES ORDER DETAILS*/
    @GetMapping("/getAllSalesOrderDetails/{salesOrderId}")
    public List<SalesOrderDetails> getAllSalesOrderDetails(@PathVariable long salesOrderId){
        List<SalesOrderDetails> soDetails = salesOrderDetailsRepository.getAllSalesOrderDetails(salesOrderId);
        return soDetails;
        /*JSONArray array =  new JSONArray();
        for(SalesOrderDetails details: soDetails){
            JSONObject object = new JSONObject();
            //if(details.getProductId() > 0){
                //object.put("productName",itemRepository.getReferenceById((long)details.getProductId()).getProductName());
            //}
            Gson gson = new GsonBuilder().disableHtmlEscaping().create();
            String inventoryBody = gson.toJson(details.getInventory());
            //String inventoryBody = new Gson().toJson(details.getInventory());
            System.out.println("inventoryBody-----"+inventoryBody);
            object.put("id",details.getId());
            //object.put("productId",details.getProductId());
            object.put("quantity",details.getQuantity());
            object.put("size", details.getSize());
            object.put("weight", details.getWeight());
            object.put("price", details.getPrice());
            object.put("sgst", details.getSgst());
            object.put("cgst", details.getCgst());
            object.put("igst", details.getIgst());
            object.put("inventory", inventoryBody);
            object.put("discountpercent", details.getDiscountpercent());
            object.put("description", details.getDescription());  
            array.put(object);          
        }
        return array.toString();
        */
    }
     /* FETCH ALL SALES ORDER DETAILS*/   
    
    /* CREATE ONLY SALESORDER */
    @PostMapping("/createSalesOrder")
    public SalesOrderRecWrapper createSalesOrder(@RequestBody String jsonWrapper) throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(jsonWrapper);
        SalesOrderDetails[] soDetails = mapper.readValue(mJsonObject.get("salesOrderDetails").toString(), SalesOrderDetails[].class);
        SalesOrder salesOrderRec = mapper.readValue(mJsonObject.get("salesOrder").toString(), SalesOrder.class);        
        User userRec = userRepository.findById(salesOrderRec.getCreatedBy()).get();        
        salesOrderRec.createdByUser = userRec;        
        SalesOrder salesOrderSaveRecord = salesOrderRepository.save(salesOrderRec);
        List<SalesOrderDetails> soDetailList = new ArrayList<SalesOrderDetails>();
        Map<Long, Integer> productMap = new HashMap<Long, Integer>();
        for(SalesOrderDetails soDetail: soDetails){
            soDetail.salesOrderId = salesOrderSaveRecord;
            soDetailList.add(soDetail);
            System.out.println("salesOrderRec.status----"+salesOrderRec.status);
            System.out.println("Harshshshshsss----"+salesOrderRec.status.contains("Delivered"));
            //if(salesOrderRec.status.contains("Delivered")){
                System.out.println("check-----------------");
                productMap.put(soDetail.inventory.getId(), soDetail.quantity);
            //}
        }
        System.out.println("productMap----"+productMap);   
        System.out.println("productMap.size()----"+productMap.size());
        if(productMap.size() != 0){
            List<Inventory> inventorys = inventoryRepository.findAllById(productMap.keySet());
            System.out.println("inventorys-------------"+inventorys);
            for(Inventory rec: inventorys){
                rec.quantity = rec.quantity - productMap.get(rec.getId());
            }
            inventoryRepository.saveAll(inventorys);
        }

        SalesOrderRecWrapper wrap = new SalesOrderRecWrapper();
        wrap.soRecord = salesOrderSaveRecord;
        wrap.soDetails = salesOrderDetailsRepository.saveAll(soDetailList);
        if(mJsonObject.has("deletedSODetails")){
            SalesOrderDetails[] deletedSODetails = mapper.readValue(mJsonObject.get("deletedSODetails").toString(), SalesOrderDetails[].class);
            if(deletedSODetails.length != 0){
                List<SalesOrderDetails> deletedSOList = Arrays.asList(deletedSODetails);
                salesOrderDetailsRepository.deleteAll(deletedSOList);
            }
        }        
        return wrap;
    }

    public class SalesOrderRecWrapper{
        public SalesOrder soRecord;
        public List<SalesOrderDetails> soDetails;
    }

    @GetMapping("/getInventoryByIds/{inventoryIds}")
    public List<Inventory> getInventoryByIds(@RequestBody List<Long> inventoryIds){
        return inventoryRepository.findAllById(inventoryIds);  
    }

    /*Create only Sales Order */

    /* CREATE PURCHASE ORDER*/
    @PostMapping("/createSalesPurchaseOrder")
    public PurchaseOrderDetailWrapper createSalesPurchaseOrder(@RequestBody String jsonWrapper) throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(jsonWrapper);
        PurchaseOrder purchaseOrderRec = mapper.readValue(mJsonObject.get("purchaseOrder").toString(), PurchaseOrder.class);        
        User userRec = userRepository.findById(purchaseOrderRec.getCreatedBy()).get();        
        purchaseOrderRec.createdByUser = userRec;            
        PurchaseOrderDetails[] poDetails = mapper.readValue(mJsonObject.get("purchaseOrderDetails").toString(), PurchaseOrderDetails[].class);
        SalesOrderDetails[] soDetails = mapper.readValue(mJsonObject.get("salesOrderDetails").toString(), SalesOrderDetails[].class);
        SalesOrder salesOrderRec = mapper.readValue(mJsonObject.get("salesOrder").toString(), SalesOrder.class); 
        salesOrderRec.createdByUser = userRec;        
        SalesOrder salesOrderSaveRecord = salesOrderRepository.save(salesOrderRec);
        PurchaseOrder purchaseOrderSaveRecord = purchaseOrderRepository.save(purchaseOrderRec);
        List<PurchaseOrderDetails> poDetailList = new ArrayList<PurchaseOrderDetails>();
        List<SalesOrderDetails> soDetailList = new ArrayList<SalesOrderDetails>();
        for(PurchaseOrderDetails poDetail: poDetails){
            poDetail.purchaseOrderId = purchaseOrderSaveRecord;
            poDetailList.add(poDetail);
        }
        poDetailList = purchaseOrderDetailsRepository.saveAll(poDetailList);
        for(SalesOrderDetails soDetail: soDetails){
            soDetail.salesOrderId = salesOrderSaveRecord;
            soDetailList.add(soDetail);
        }        
        salesOrderDetailsRepository.saveAll(soDetailList);
        PurchaseOrderDetailWrapper wrap = new PurchaseOrderDetailWrapper();
        wrap.purchaseOrderRec = purchaseOrderSaveRecord;
        wrap.purchaseOrderDetails = poDetailList;
        return wrap;
    }
    
    public class PurchaseOrderDetailWrapper{
        public PurchaseOrder purchaseOrderRec;
        public List<PurchaseOrderDetails> purchaseOrderDetails;
    } 

    /* CREATE PURCHASE ORDER*/
    @PostMapping("/createPurchaseOrder")
    public PurchaseOrderDetailWrapper createPurchaseOrder(@RequestBody String jsonWrapper) throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(jsonWrapper);
        PurchaseOrder purchaseOrderRec = mapper.readValue(mJsonObject.get("purchaseOrder").toString(), PurchaseOrder.class);        
        PurchaseOrderDetails[] poDetails = mapper.readValue(mJsonObject.get("purchaseOrderDetails").toString(), PurchaseOrderDetails[].class);
        User userRec = userRepository.findById(purchaseOrderRec.getCreatedBy()).get();        
        purchaseOrderRec.createdByUser = userRec;        
        PurchaseOrder purchaseOrderSaveRecord = purchaseOrderRepository.save(purchaseOrderRec);
        List<PurchaseOrderDetails> poDetailList = new ArrayList<PurchaseOrderDetails>();
        for(PurchaseOrderDetails poDetail: poDetails){
            poDetail.purchaseOrderId = purchaseOrderSaveRecord;
            poDetailList.add(poDetail);
        }
        System.out.println("poDetailList----------"+poDetailList);
        poDetailList = purchaseOrderDetailsRepository.saveAll(poDetailList); 
        PurchaseOrderDetailWrapper wrap = new PurchaseOrderDetailWrapper();
        wrap.purchaseOrderRec = purchaseOrderSaveRecord;
        wrap.purchaseOrderDetails = poDetailList;
        System.out.println("mJsonObject.ha----------"+mJsonObject.has("deletedPODetails"));
        if(mJsonObject.has("deletedPODetails")){
            System.out.println("checking-------");
            PurchaseOrderDetails[] deletedPODetails = mapper.readValue(mJsonObject.get("deletedPODetails").toString(), PurchaseOrderDetails[].class);
            System.out.println("deletedPODetails.length != 0----------------"+deletedPODetails.length);
            if(deletedPODetails.length != 0){
                List<PurchaseOrderDetails> deletedPOList = Arrays.asList(deletedPODetails);
                purchaseOrderDetailsRepository.deleteAll(deletedPOList);
            }
        }               
        return wrap;
    } 
   /* CREATE PURCHASE ORDER/ SALESORDER */

   @PostMapping("/addInventory")
   public Inventory addInventory(@RequestBody String jsonWrapper) throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(jsonWrapper);
        Inventory inventory = mapper.readValue(mJsonObject.get("inventory").toString(), Inventory.class);
        Category category = mapper.readValue(mJsonObject.get("category").toString(), Category.class);
        Rack rack = mapper.readValue(mJsonObject.get("rack").toString(), Rack.class);
        Warehouse warehouse = mapper.readValue(mJsonObject.get("warehouse").toString(), Warehouse.class);
        User userRec = userRepository.findById(inventory.getCreatedBy()).get();        
        inventory.createdByUser = userRec;
        System.out.println("category----"+category.id);
        System.out.println("rack.id----"+rack.id);
        if(warehouse != null){
            inventory.warehouse = warehouse;
        }
        if(rack.id == -1){
            inventory.category = categoryRepository.findById(category.id).get();
            System.out.println("inventory.category------"+inventory.category);
            inventory = inventoryRepository.save(inventory);
            if(warehouse != null){
                inventory.warehouse = warehouseRepository.findById(warehouse.getId()).get();
            }
            return inventory;
        }else if(rack.id == 0){
            Rack rackRec = mapper.readValue(mJsonObject.get("rack").toString(), Rack.class);
            rackRec.createdByUser = userRec;
            inventory.category = categoryRepository.findById(category.id).get();
            inventory.rack = rackRepository.save(rackRec);
            inventory = inventoryRepository.save(inventory);
            if(warehouse != null){
                inventory.warehouse = warehouseRepository.findById(warehouse.getId()).get();
            }
            return inventory;          
        }else{
            inventory.rack = rackRepository.findById(rack.id).get();
            System.out.println("inventory.rack------"+inventory.rack);
            inventory.category = categoryRepository.findById(category.id).get();
            System.out.println("inventory.category------"+inventory.category);
            inventory = inventoryRepository.save(inventory);
            if(warehouse != null){
                inventory.warehouse = warehouseRepository.findById(warehouse.getId()).get();
            }
            return inventory;
        } 
   }

   @GetMapping("/getRackByUserId/{userId}")
   public List<Rack> getRackByUserId(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName(); 
        return rackRepository.getRackByUserId(userId, companyName); 
    }

    @GetMapping("/getInventoryById/{id}")
    public Inventory getInventoryById(@PathVariable long id){
        return inventoryRepository.findById(id).get();
    }

    @GetMapping("/getInventoryByWareHouseId/{warehouseId}")
    public List<Inventory> getInventoryByWareHouseId(@PathVariable long warehouseId){  
     List<Inventory> inventoryList = inventoryRepository.getInventoryByWareHouseId(warehouseId);
     return inventoryList;
     /* JSONArray array =  new JSONArray();
         for(Inventory details: inventoryList){
             JSONObject object = new JSONObject();
             if(details.getProduct().getId() > 0){
                 object.put("productName",itemRepository.getReferenceById((long)details.getProduct().getId()).getProductName());
                 object.put("productType",itemRepository.getReferenceById((long)details.getProduct().getId()).getType());
                 object.put("productDescription",itemRepository.getReferenceById((long)details.getProduct().getId()).getDescription());
             }
             if(details.getWarehouseId() > 0){
                 object.put("warehouseName",warehouseRepository.getReferenceById((long)details.getWarehouseId()).getName());
             }
             object.put("inventoryId",details.getId());
             object.put("categoryId",details.getCategory().getId());
             object.put("categoryName",details.getCategory().getName());
             object.put("purchaseOrderId",details.getPurchaseOrderId());
             object.put("productId",details.getProduct().getId());
             object.put("quantity",details.getQuantity());
             object.put("size", details.getSize());
             object.put("weight", details.getWeight());
             object.put("price", details.getPrice());
             object.put("rackId", details.getRack().getId());
             object.put("rackName", details.getRack().getName());
             object.put("hsncode", details.getHsncode());
             object.put("warehouseId", details.getWarehouseId());
             object.put("description", details.getDescription());  
             object.put("sgst", details.getSgst());
             object.put("cgst", details.getCgst()); 
             object.put("igst", details.getIgst());                       
             array.put(object);          
         }
         return array.toString();
        */
    }    

   @GetMapping("/getInventoryByUserId/{userId}")
   public List<Inventory> getInventoryByUserId(@PathVariable long userId){
    User userRec = userRepository.findById(userId).get();
    String companyName = userRec.getCompanyName();    
    List<Inventory> inventoryList = inventoryRepository.getInventoryByUserId(userId, companyName);
    return inventoryList;
    //JSONArray array =  new JSONArray();
    /* for(Inventory details: inventoryList){
            JSONObject object = new JSONObject();
            if(details.getProduct().getId() > 0){
                object.put("productName",itemRepository.getReferenceById((long)details.getProduct().getId()).getProductName());
                object.put("productType",itemRepository.getReferenceById((long)details.getProduct().getId()).getType());
                System.out.println("Harsh-----------------"+itemRepository.getReferenceById((long)details.getProduct().getId()).getDescription());
                object.put("productDescription",itemRepository.getReferenceById((long)details.getProduct().getId()).getDescription());
            }
            if(details.getWarehouseId() > 0){
                object.put("warehouseName",warehouseRepository.getReferenceById((long)details.getWarehouseId()).getName());
            }
            object.put("inventoryId",details.getId());
            object.put("categoryId",details.getCategory().getId());
            object.put("categoryName",details.getCategory().getName());
            object.put("purchaseOrderId",details.getPurchaseOrderId());
            object.put("productId",details.getProduct().getId());
            object.put("quantity",details.getQuantity());
            object.put("size", details.getSize());
            object.put("weight", details.getWeight());
            object.put("price", details.getPrice());
            object.put("rackId", details.getRack().getId());
            object.put("rackName", details.getRack().getName());
            object.put("hsncode", details.getHsncode());
            object.put("warehouseId", details.getWarehouseId());
            object.put("description", details.getDescription());  
            object.put("sgst", details.getSgst());
            object.put("cgst", details.getCgst()); 
            object.put("igst", details.getIgst());                       
            array.put(object);          
        }
        return array.toString();
        */
   }

   @DeleteMapping("/deleteInventoryById/{id}")
   public void deleteInventoryById(@PathVariable long id){
        inventoryRepository.deleteById(id);
   }  
   
   @PostMapping("/upload")
   public Document uploadFile(@RequestPart("file") MultipartFile file, 
                              @RequestPart("fileWrapper") String fileWrapper) throws IOException {
        byte[] fileData = file.getBytes();
        Document fileEntity = new Document();
        System.out.println("fileWrapper-----"+fileWrapper);
        System.out.println("file-----"+file);
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        FileWrapper wrap = mapper.readValue(fileWrapper,  FileWrapper.class);
        System.out.println("wrap-----"+wrap);
        System.out.println("wrap.referenceType-----"+wrap.referenceType);
        System.out.println("wrap.referenceId-----"+wrap.referenceId);
        //System.out.println("checking-----"+wrap.referenceType.contains("PurchaseOrder"));
        fileEntity.setFileData(fileData);
        fileEntity.setFileName(wrap.fileName);
        fileEntity.setFileType(wrap.fileType);
        if(wrap.createdbyid != 0){
            User userRec = new User();
            userRec.setId(wrap.createdbyid);
            fileEntity.setCreatedByUser(userRec);
        }else if(wrap.lastmodifybyid != 0){
            User userRec = new User();
            userRec.setId(wrap.lastmodifybyid);
            fileEntity.setLastModifiedByUser(userRec);            
        }

        if(wrap.lastModifiedDate != null){
            fileEntity.setLastModifiedDate(wrap.lastModifiedDate);
        }else if(wrap.createdDate != null){
            fileEntity.setCreatedDate(wrap.createdDate);
        }

        if(wrap.fileId !=0){
            fileEntity.setId(wrap.fileId);
        }
        if(wrap.referenceType != null && wrap.referenceType.contains("SalesOrder")){
            fileEntity.setSalesOrderId(wrap.referenceId);
        }else if(wrap.referenceType != null && wrap.referenceType.contains("PurchaseOrder")){
            System.out.println("wrap.referenceId-----------"+wrap.referenceId);
            fileEntity.setPurchaseOrderId(wrap.referenceId);
        }else if(wrap.referenceType != null  && wrap.referenceType.contains("Quotation")){
            fileEntity.setQuotationId(wrap.referenceId);
        }
        return documentRepository.save(fileEntity);
   }

   @GetMapping("/getAllFiles/{referenceType}/{referenceId}")
   public List<Document> getAllFiles(@PathVariable long referenceId, @PathVariable String referenceType){
        if(referenceType.contains("SalesOrder")){
            return documentRepository.getDocumentBySOId(referenceId);
        }else if(referenceType.contains("PurchaseOrder")){
            return documentRepository.getDocumentByPOId(referenceId);
        }else if(referenceType.contains("Quotation")){
            return documentRepository.getDocumentByQuotationId(referenceId);
        }
        return null;
    }

    @PostMapping("/sendForApproval")
    public void sendForApproval(@RequestBody String jsonWrapper) throws JsonMappingException, JsonProcessingException, JSONException{
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        JSONObject mJsonObject = new JSONObject(jsonWrapper);
        Approvers[] approvers = mapper.readValue(mJsonObject.get("approvers").toString(), Approvers[].class);        
        //approverRepository.save(new List<Approvers>(approvers));
        List<Approvers> approverList = Arrays.asList(approvers);
        approverRepository.saveAll(approverList);
    }
    
    @GetMapping("/getAllWorkOrders/{userId}")
    public List<WorkOrder> getAllWorkOrders(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return workOrderRepository.getWorkOrders(userId, companyName);
    }      

    @GetMapping("/getAllWorkOrderItems/{workOrderId}")
    public List<WorkOrderItems> getAllWorkOrderItems(@PathVariable long workOrderId){
        System.out.println("workOrderId----"+workOrderId);
        return workOrderItemsRepository.getWorkOrdersItems(workOrderId);
    }  

    @DeleteMapping("/deleteWorkOrderById/{id}")
    public void deleteWorkOrderById(@PathVariable long id){
        WorkOrder workOrder = workOrderRepository.findById(id).get();
        List<WorkOrderItems> itemsList = workOrderItemsRepository.getWorkOrdersItems(workOrder.id);
       if(itemsList != null && !itemsList.isEmpty()){
           workOrderItemsRepository.deleteAll(itemsList);
       }
       workOrderRepository.deleteById(id);
    } 
    
    @PostMapping("/addWorkOrderWithItems")
    public WorkOrder addWorkOrderWithItems(@RequestBody String jsonWrapper) throws JsonMappingException, JsonProcessingException, JSONException{
         ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
         JSONObject mJsonObject = new JSONObject(jsonWrapper);
         System.out.println("checkingHarsh---");
         WorkOrder workOrder = mapper.readValue(mJsonObject.get("workorder").toString(), WorkOrder.class);
         WorkOrderItems[] workOrderItems = mapper.readValue(mJsonObject.get("workOrderItems").toString(), WorkOrderItems[].class);
         
         System.out.println("workOrder---"+workOrder);

         workOrder = workOrderRepository.save(workOrder);

         System.out.println("workOrderItems---"+workOrderItems);
         List<WorkOrderItems> woItems = new ArrayList<WorkOrderItems>();
         for(WorkOrderItems items: workOrderItems){
            items.workOrder = workOrder;
            woItems.add(items);
         }
         workOrderItemsRepository.saveAll(woItems);

         WorkOrderItems[] deleteWorkOrderItems = mapper.readValue(mJsonObject.get("deleteWorkOrderItems").toString(), WorkOrderItems[].class);
         if(deleteWorkOrderItems != null){
            List<WorkOrderItems> deletedItems = Arrays.asList(deleteWorkOrderItems);
            workOrderItemsRepository.deleteAll(deletedItems);
         }
         return workOrder;
    }    

    @GetMapping("/getInventoryCount/{userId}")
    public Integer getInventoryCount(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return inventoryRepository.getInventoryCount(userId, companyName);
    } 
    
    @GetMapping("/getWarehouseCount/{userId}")
    public Integer getWarehouseCount(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return warehouseRepository.getWarehouseCount(userId, companyName);
    }

    @GetMapping("/getTotalCost/{userId}")   
    public Double getTotalCost(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return inventoryRepository.getTotalCost(userId, companyName);
    }
    
    @GetMapping("/getAllTodaysTask/{userId}")
    public TodayTaskWrapper getAllTodaysTask(@PathVariable long userId){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        Date todayDate = new Date();
        List<WorkOrder> woList = workOrderRepository.getAllExpriyWorkOrder(userId, 
                                                                        companyName, 
                                                                        todayDate,
                                                                         "AMC");
        List<PurchaseOrder> poList = purchaseOrderRepository.getAlPurchaseOrderBasedOnDeliveryDate(userId, companyName);
        List<SalesOrder> soList = salesOrderRepository.getAllSalesOrderBasedOnDeliveryDate(userId, companyName);
        TodayTaskWrapper tasks = new TodayTaskWrapper();
        tasks.soList = soList;
        tasks.poList = poList;
        tasks.woList = woList;
        return tasks;
    }

    public class TodayTaskWrapper{
        public List<SalesOrder> soList;
        public List<PurchaseOrder> poList;
        public List<WorkOrder> woList;
    }

    @GetMapping("/getSalesOrderBasedOnStatus/{userId}/{status}")   
    public Integer getSalesOrderBasedOnStatus(@PathVariable long userId, @PathVariable String status){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return salesOrderRepository.getSalesOrderBasedOnStatus(userId, companyName, status);
    }

    @GetMapping("/getPurchaseOrderBasedOnStatus/{userId}/{status}")   
    public Integer getPurchaseOrderBasedOnStatus(@PathVariable long userId, @PathVariable String status){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return purchaseOrderRepository.getPurchaseOrderBasedOnStatus(userId, companyName, status);
    }
    
    @GetMapping("/getQuotationBasedOnStatus/{userId}/{status}")   
    public Integer getQuotationBasedOnStatus(@PathVariable long userId, @PathVariable String status){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return quotationRepository.getQuotationBasedOnStatus(userId, companyName, status);
    }
    
    @GetMapping("/groupByBasedOnStatus/{userId}/{monthname}/{year}")   
    public SOPOQuoationStatusWrap groupByBasedOnStatus(@PathVariable long userId, 
                                                        @PathVariable String monthname,
                                                        @PathVariable Integer year){
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        SOPOQuoationStatusWrap wrap = new SOPOQuoationStatusWrap();
        wrap.poList = purchaseOrderRepository.groupByBasedOnStatus(userId, companyName, monthname,year);
        wrap.soList = salesOrderRepository.groupByBasedOnStatus(userId, companyName, monthname, year);
        wrap.quotationList = quotationRepository.groupByBasedOnStatus(userId, companyName, monthname, year);
        return wrap;
    } 

    @GetMapping("/getRecordBasedOnCustomerId/{userId}/{customerid}/{monthname}/{year}") 
    public SOPOQuoationStatusWrap getRecordBasedOnCustomerId(@PathVariable long userId, 
                                                            @PathVariable long customerid,
                                                            @PathVariable String monthname,
                                                            @PathVariable Integer year){
        
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        SOPOQuoationStatusWrap wrap = new SOPOQuoationStatusWrap();
        wrap.poList = purchaseOrderRepository.getPOBasedOnCustomer(userId, companyName, monthname,year, customerid);
        wrap.soList = salesOrderRepository.getSOBasedOnCustomer(userId, companyName, monthname, year, customerid);
        wrap.quotationList = quotationRepository.getQuotationBasedOnCustomer(userId, companyName, monthname, year, customerid);
        wrap.workOrderList = workOrderRepository.getWOBasedOnCustomer(userId, companyName, monthname, year, customerid);
        return wrap;
    }
      
    
    public class SOPOQuoationStatusWrap{
        public List<Object> soList;
        public List<Object> poList;
        public List<Object> quotationList;
        public List<Object> workOrderList;
    }



    @GetMapping("/getSalesOrderAccountingForMonthYear/{userId}/{year}") 
    public List<YearMonthObjectSOWrapper> getSalesOrderAccountingForMonthYear(@PathVariable long userId,
                                                                @PathVariable Integer year){
        
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return salesOrderRepository.getSalesOrderAccountingForMonthYear(userId, companyName, year);
    }

    @GetMapping("/getPurchaseOrderAccountingForMonthYear/{userId}/{year}") 
    public List<YearMonthObjectPOWrapper> getPurchaseOrderAccountingForMonthYear(@PathVariable long userId,
                                                                      @PathVariable Integer year){
        
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return purchaseOrderRepository.getPurchaseOrderAccountingForMonthYear(userId, companyName, year);
    }
    
    @GetMapping("/getWorkOrderAccountingForMonthYear/{userId}/{category}/{year}") 
    public List<YearMonthObjectWOWrapper> getWorkOrderAccountingForMonthYear(@PathVariable long userId,
                                                              @PathVariable String category,
                                                              @PathVariable Integer year){
        
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return workOrderRepository.getWorkOrderAccountingForMonthYear(userId, companyName, year, category);
    } 
    
    @GetMapping("/getSalesOrderTotalAmountByMonthYear/{userId}/{year}") 
    public List<SalesOrderWrapper> getSalesOrderTotalAmountByMonthYear(@PathVariable long userId,
                                                              @PathVariable Integer year){
        
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return salesOrderRepository.getSalesOrderTotalAmountByMonthYear(userId, companyName, year);
    }
    
    @GetMapping("/getPurchaseOrderTotalAmountByMonthYear/{userId}/{year}") 
    public List<PurchaseOrderWrapper> getPurchaseOrderTotalAmountByMonthYear(@PathVariable long userId,
                                                              @PathVariable Integer year){
        
        User userRec = userRepository.findById(userId).get();
        String companyName = userRec.getCompanyName();
        return purchaseOrderRepository.getPurchaseOrderTotalAmountByMonthYear(userId, companyName, year);
    }

   @PostMapping("/createUpdateCompany")
    public Company createUpdateCompany(@RequestPart("logo") MultipartFile logo, 
                                      @RequestPart("companywrapper") String companywrapper) throws IOException {
        byte[] companylogo = logo.getBytes();
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        Company company = mapper.readValue(companywrapper,  Company.class);
        company.setLogo(companylogo);
        return companyRepository.save(company);
    }

    @DeleteMapping("/deleteCompanyById/{id}")
    public void deleteCompanyById(@PathVariable long id){
        companyRepository.deleteById(id);
    }

    
    @PostMapping("/createUpdateProfile")
    public Profile createUpdateProfile(@RequestBody Profile profile){
        return profileRepository.save(profile);
    }
    
    @DeleteMapping("/deleteProfileById/{id}")
    public void deleteProfileById(@PathVariable long id){
        profileRepository.deleteById(id);
    }    

    @PostMapping("/createUpdateAppUser")
    public AppUser createUpdateAppUser(@RequestBody AppUser appUser){
        AppUser user = appUserRespository.save(appUser);
        user.profile = profileRepository.findById(user.profile.id).get();
        user.company = companyRepository.findById(user.company.id).get();
        System.out.println("user.profile---"+user.profile);
        System.out.println("user.company---"+user.company);
        return user;
        
    }

    @DeleteMapping("/deleteAppUserById/{id}")
    public void deleteAppUserById(@PathVariable long id){
        appUserRespository.deleteById(id);
    }      

    @PostMapping("/createUpdateAppObject")
    public AppObject createUpdateAppObject(@RequestBody AppObject appObject) throws IOException{
        /*byte[] fileData = file.getBytes();
        ObjectMapper mapper = new ObjectMapper().registerModule(new JsonComponentModule());
        AppObject wrap = mapper.readValue(appObjectWrapper, AppObject.class);
        wrap.setLogo(fileData);*/
        return appObjectRepository.save(appObject);
    } 

    @DeleteMapping("/deleteAppObjectById/{id}")
    public void deleteAppObjectById(@PathVariable long id){
        appObjectRepository.deleteById(id);
    }      
    

    @PostMapping("/createUpdateAppObjField")
    public AppObjectField createUpdateAppObjField(@RequestBody AppObjectField appObjField){
        return appObjectFieldRespository.save(appObjField);
    }


    @DeleteMapping("/deleteAppObjFieldById/{id}")
    public void deleteAppObjFieldById(@PathVariable long id){
        appObjectFieldRespository.deleteById(id);
    }      

    @PostMapping("/createUpdateSchema")
    public Schema createUpdateSchema(@RequestBody Schema schema){
        Schema schemaRecord = schemaRepository.save(schema);
        schemaRecord.profile = profileRepository.findById(schemaRecord.profile.id).get();
        schemaRecord.company = companyRepository.findById(schemaRecord.company.id).get();
        schemaRecord.appobject = appObjectRepository.findById(schemaRecord.appobject.id).get();
        schemaRecord.objectfield = appObjectFieldRespository.findById(schemaRecord.objectfield.id).get();
        return schemaRecord;
    } 

    @DeleteMapping("/deleteSchemaById/{id}")
    public void deleteSchemaById(@PathVariable long id){
        schemaRepository.deleteById(id);
    }

    @DeleteMapping("/deleteSchemaRecordById/{id}")
    public void deleteSchemaRecordById(@PathVariable long id){
        schemaRecordRepository.deleteById(id);
    }       

    @GetMapping("/getAllAppUser") 
    public List<AppUser> getAllAppUser(){
        return appUserRespository.findAll();
    } 
    
    @GetMapping("/getAllCompanys") 
    public List<Company> getAllCompanys(){
        return companyRepository.findAll();
    }  
    
    @GetMapping("/getAllProfiles") 
    public List<Profile> getAllProfile(){
        return profileRepository.findAll();
    }   
    
    @GetMapping("/getAllObjects") 
    public List<AppObject> getAllObjects(){
        return appObjectRepository.findAll();
    }
    
    @GetMapping("/getAllFields") 
    public List<AppObjectField> getAllFields(){
        return appObjectFieldRespository.findAll();
    }

    
    @GetMapping("/getSchemas") 
    public List<Schema> getSchemas(){
        return schemaRepository.findAll();
    }

    @GetMapping("/getAppUser/{username}/{password}") 
    public List<AppUser> getAppUserInfo(@PathVariable String username,@PathVariable String password){
        return appUserRespository.getAppUserByUserName(username, password); 
    }   

    @GetMapping("/getAppUserInfo") 
    public List<AppUser> getAppUserInfo(@RequestParam MultiValueMap<String, String> requestParams){
        System.out.println("requestParams---"+requestParams);
        System.out.println("check---"+requestParams.getFirst("username"));
        return appUserRespository.getAppUserByUserName(requestParams.getFirst("username"), 
                                                       requestParams.getFirst("password"));
    }

    @GetMapping("/getSchemaTabs/{companyid}/{profileid}") 
    public List<SchemaTabWrapper> getSchemaTabs(@PathVariable long companyid,@PathVariable long profileid){
        return schemaRepository.getSchemaTabs(companyid, profileid);
    }  
    
    @GetMapping("/getSchemaObjFields/{companyid}/{profileid}/{tabid}") 
    public List<SchemaFieldWrapper> getSchemaObjFields(@PathVariable long companyid, 
                                           @PathVariable long profileid, 
                                           @PathVariable long tabid){
        return schemaRepository.getSchemaObjFields(companyid, profileid, tabid);
    }

    @PostMapping("/createUpdateSchemaRecord")
    public SchemaRecord createUpdateSchemaRecord(@RequestBody SchemaRecord schemaRecord){
        return schemaRecordRepository.save(schemaRecord);
    }

 
    @GetMapping("/getSchemaRecordIdBasedonTabId/{companyid}/{profileid}/{tabid}")
    public SchemaRecord getSchemaRecordIdBasedonTabId(@PathVariable long companyid, 
                                                      @PathVariable long profileid, 
                                                      @PathVariable long tabid){
        List<SchemaRecord> schemaRecordList =  schemaRecordRepository.getSchemaRecordIdBasedonTabId(companyid, profileid, tabid);
        return schemaRecordList.get(0);
    }
 /* */   
    @PostMapping("/createUpdateSchemaRecordFieldValue")
    public SchemaRecordFieldValue createUpdateSchemaRecordFieldValue(@RequestBody SchemaRecordWrapper schemaRecordWrapper){
        SchemaRecord schemaRecord = schemaRecordWrapper.schemaRecord;
        schemaRecord = schemaRecordRepository.save(schemaRecord);

        SchemaRecordFieldValue schemaRecordFieldValue = new SchemaRecordFieldValue();
        schemaRecordFieldValue.setSchemarecord(schemaRecord);
        schemaRecordFieldValue.setAllfieldvalue(schemaRecordWrapper.fieldsvalues);
        schemaRecordFieldValue.setCreatedby(schemaRecord.createdby);
        schemaRecordFieldValue.setCreateddate(schemaRecord.createddate);
        schemaRecordFieldValue.setLastmodifiedby(schemaRecord.lastmodifiedby);
        schemaRecordFieldValue.setLastmodifieddate(schemaRecord.lastmodifieddate);

        return schemaRecordFieldValueRepository.save(schemaRecordFieldValue);
    }

    public class SchemaRecordWrapper{
        public SchemaRecord schemaRecord;
        public String fieldsvalues;
    }
}