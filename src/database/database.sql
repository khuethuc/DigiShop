create database DigiShopdb;
use DigiShopdb;
show tables;
-- drop database DigiShopdb;

-- -----------------------------------------------------TABLES-----------------------------------------------------------------------------
create table Users(
	customerID int primary key auto_increment,
    Username varchar(30),
    Userpassword varchar(80),
    Email varchar(100),
    PhoneNumber varchar(30),
    Name varchar(30)
);

create table Cart(
	CartID varchar(30) primary key,
    Cart_TotalAmount int,
    UserID int                -- thêm để FK Cart -> Users
);

create table CartItem(
	CartItemID varchar(30) primary key,
	CartID varchar(30),       -- thêm để FK CartItem -> Cart
	Ci_Quantity varchar(30),
    CI_price Decimal
);

create table Payment(
	PaymentID varchar(30) primary key,
    Pay_method varchar(30)
);

create table Discount_Total(
	Discount_TotalID varchar(30) primary key,
	TotalPercent_Dis Float
);

create table Orders(
	OrderID int primary key auto_increment,
    TotalAmount int,
    Order_Status varchar(30),
    UserID int,            
    Discount_TotalID varchar(30)
);

create table Feedbacks (
	FeedbackID varchar(30) primary key,
    Score float Check ( Score  <= 5 and Score >= 0),
    Comments varchar (100),
    InventoryID varchar(30),  -- thêm để FK -> Inventory
    UserID int                -- thêm để FK -> Users
);
create table OrderItem (
	OrderItemID int primary key auto_increment,
    Price Decimal,
    Quantity int,
    InventoryID varchar(30),  -- thêm để FK -> Inventory
    OrderID int               -- thêm để FK -> Orders
);

create table Category (
	CategoryID varchar(30) primary key,
    Sub_category varchar(30),
    CategoryName varchar (40)
);

create table Discount_Cate (
	Discount_CateID varchar(30) primary key,
    CatePercent_Dis Float,
    CategoryID varchar(30)    -- thêm để FK -> Category
);

create table Inventory (
	InventoryID varchar(30) primary key,
    Inventory_Quantity int,
    Inventory_Name varchar(30),
    Inventory_status varchar(30),
    CategoryID varchar(30)    -- thêm để FK -> Category
);

create table Accounts (
	AccountID int primary key auto_increment,
	Account_Name varchar(50),
    Account_password varchar(80),
    InventoryID varchar(30)   -- thêm để FK -> Inventory
);


-- -----------------------------------------------------Foreign Keys-----------------------------------------------------------------------------
alter table Accounts add foreign key (InventoryID) references Inventory(InventoryID);
alter table Inventory add foreign key (CategoryID) references Category(CategoryID);
alter table Discount_Cate add foreign key (CategoryID) references Category(CategoryID);
alter table OrderItem add foreign key (InventoryID) references Inventory(InventoryID);
alter table OrderItem add foreign key (OrderID) references Orders(OrderID);
alter table Feedbacks add foreign key (InventoryID) references Inventory(InventoryID);
alter table Feedbacks add foreign key (UserID) references Users(customerID);
alter table Orders add foreign key (UserID) references Users(customerID);
alter table Orders add foreign key (Discount_TotalID) references Discount_Total(Discount_TotalID);
alter table CartItem add foreign key (CartID) references Cart(CartID);
alter table Cart add foreign key (UserID) references Users(customerID);


-- -----------------------------------------------------Selects-----------------------------------------------------------------------------
select * from Users;
select * from Cart;
select * from CartItem;
select * from Payment;
select * from Discount_Total;
select * from Orders;
select * from Feedbacks;
select * from OrderItem;
select * from Category;
select * from Discount_Cate;
select * from Inventory;
select * from Accounts;

-- -----------------------------------------------------INSERT -----------------------------------------------------------------------------
insert into Users (customerID,Username,Userpassword,Email,PhoneNumber,Name)
Values ('','','','','','');

insert into Cart(CartID,Cart_TotalAmount,UserID) Values ('','','');
insert into CartItem(CartItemID,CartID,Ci_Quantity,CI_price) Value ('','','','');
insert into Payment (PaymentID,Pay_method) Value ('','');
insert into Discount_Total (Discount_TotalID,TotalPercent_Dis) Value ('','');
insert into Orders (OrderID,TotalAmount,Order_Status,UserID,Discount_TotalID) Value ('','','','','');
insert into Feedbacks (FeedbackID,Score,Comments,InventoryID,UserID) Value ('','','','','');
insert into OrderItem (OrderItemID,Price,Quantity,InventoryID,OrderID) Value ('','','','','');
insert into Category (CategoryID,Sub_category,CategoryName) Value ('','','');
insert into Discount_Cate (Discount_CateID,CatePercent_Dis,CategoryID) Value ('','','');
insert into Inventory (InventoryID,Inventory_Quantity,Inventory_Name,Inventory_status,CategoryID) Value ('','','','','');
insert into Accounts (AccountID,Account_Name,Account_password,InventoryID) Value ('','','','');


