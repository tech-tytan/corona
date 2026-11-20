<?php

use App\Http\Controllers\AdminHeaderController;
use App\Http\Controllers\AdminSigninController;
use App\Http\Controllers\AdminSignoutController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenditureController;
use App\Http\Controllers\FinancialSummaryController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SuspendedCartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserHeaderController;
use App\Http\Controllers\UserSigninController;
use App\Http\Controllers\UserSignoutController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::resource('admin_signin',AdminSigninController::class);

Route::resource('forgot_password',ForgotPasswordController::class);

Route::resource('admin_header',AdminHeaderController::class)->middleware("user");

Route::resource('dashboard',DashboardController::class)->middleware("user");

Route::resource('revenues',RevenueController::class)->middleware("user");

Route::resource('categories',CategoryController::class)->middleware("user");

Route::resource('products',ProductController::class)->middleware("user");

Route::resource('expenditures',ExpenditureController::class)->middleware("user");

Route::resource('users',UserController::class)->middleware("user");

Route::resource('financial_summary',FinancialSummaryController::class)->middleware("user");

Route::resource('logs',LogController::class)->middleware("user");

Route::resource('suspended_carts',SuspendedCartController::class)->middleware("user");

Route::resource('profile',ProfileController::class)->middleware("user");

Route::resource('admin_signout',AdminSignoutController::class);

Route::resource('user_signin',UserSigninController::class);

Route::resource('user_header',UserHeaderController::class)->middleware("user");

Route::resource('sales',SaleController::class)->middleware("user");

Route::resource('user_signout',UserSignoutController::class);
