import 'package:flutter/material.dart';
import 'package:zembil/core/utils.dart';

ThemeData primaryTheme = ThemeData(
  splashColor: Colors.grey,
  fontFamily: "Poppins",
  primaryColor: primaryColor,
  primaryColorLight: primaryColorLight,
  primaryColorDark: primaryColorDark,
  scaffoldBackgroundColor: Colors.black,
  textTheme: const TextTheme(
    headlineLarge: TextStyle(
        color: Colors.black,
        fontWeight: FontWeight.bold,
        fontFamily: 'poppins',
        fontSize: 24),
    headlineMedium: TextStyle(
        color: Colors.black,
        fontWeight: FontWeight.bold,
        fontFamily: 'poppins',
        fontSize: 16),
    titleMedium: TextStyle(
      fontSize: 40,
      fontWeight: FontWeight.w700,
      color: Colors.black,
    ),
    bodyLarge: TextStyle(
        fontWeight: FontWeight.w300,
        fontSize: 16,
        fontFamily: 'poppins',
        letterSpacing: -0.25,
        color: Colors.black),
    bodyMedium: TextStyle(
        fontWeight: FontWeight.w300,
        fontSize: 14,
        letterSpacing: -0.25,
        color: primaryColor),
    labelLarge: TextStyle(
        color: primaryColor,
        fontWeight: FontWeight.bold,
        fontFamily: 'poppins',
        fontSize: 16),
    labelMedium: TextStyle(
      color: Colors.black,
      fontWeight: FontWeight.w300,
      letterSpacing: -0.25,
      fontSize: 14,
    ),
    bodySmall: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: Colors.black,
    ),
    labelSmall: TextStyle(
      color: Colors.black,
      fontSize: 13,
      letterSpacing: -0.25,
      fontWeight: FontWeight.w400,
    ),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ButtonStyle(
      backgroundColor: const WidgetStatePropertyAll(Colors.black),
      foregroundColor: const WidgetStatePropertyAll(Colors.white),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
      ),
    ),
  ),
);

ThemeData secondaryTheme = ThemeData(
  splashColor: Colors.grey,
  fontFamily: "Poppins",
  primaryColor: Colors.white,
  primaryColorLight: secondaryColorLight,
  primaryColorDark: secondaryColorDark,
  scaffoldBackgroundColor: Colors.white,
  textTheme: const TextTheme(
    titleMedium: TextStyle(
      fontSize: 40,
      fontWeight: FontWeight.w700,
      color: Colors.black,
    ),
    bodyMedium: TextStyle(
        fontWeight: FontWeight.w300,
        fontSize: 14,
        letterSpacing: -0.25,
        color: Colors.black),
    labelLarge: TextStyle(
        color: Colors.black,
        fontWeight: FontWeight.bold,
        fontFamily: 'poppins',
        fontSize: 16),
    labelMedium: TextStyle(
      color: Colors.black,
      fontWeight: FontWeight.w300,
      fontSize: 14,
    ),
    bodySmall: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: Colors.black,
    ),
    labelSmall: TextStyle(
      color: Colors.black,
      fontSize: 13,
      letterSpacing: -0.25,
      fontWeight: FontWeight.w400,
    ),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ButtonStyle(
      backgroundColor: const WidgetStatePropertyAll(primaryColor),
      foregroundColor: const WidgetStatePropertyAll(Colors.white),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
      ),
    ),
  ),
);

ThemeData darkTheme = ThemeData(
  splashColor: Colors.white,
  brightness: Brightness.dark,
  fontFamily: "Poppins",
  primaryColor: primaryDarkModeColor,
  primaryColorLight: fontGrey,
  primaryColorDark: primaryDarkModeColor,
  scaffoldBackgroundColor: backgroundColor3,
  textTheme: const TextTheme(
    titleMedium: TextStyle(
      fontSize: 40,
      fontWeight: FontWeight.w700,
      color: primaryDarkModeColor,
    ),
    bodyMedium: TextStyle(
        fontWeight: FontWeight.w300,
        fontSize: 14,
        letterSpacing: -0.25,
        color: primaryDarkModeColorLight),
    labelLarge: TextStyle(
        color: primaryColor,
        fontWeight: FontWeight.bold,
        fontFamily: 'poppins',
        fontSize: 16),
    labelMedium: TextStyle(
      color: primaryDarkModeColorLight,
      fontWeight: FontWeight.w300,
      fontSize: 14,
    ),
    bodySmall: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: primaryColor,
    ),
    labelSmall: TextStyle(
      color: fontGrey,
      fontSize: 13,
      letterSpacing: -0.25,
      fontWeight: FontWeight.w400,
    ),
  ),
);
