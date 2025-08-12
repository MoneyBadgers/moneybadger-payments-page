import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import 'package:webview_flutter/webview_flutter.dart';

class CryptoPayment extends StatefulWidget {
  final int amountCents;
  final String orderDescription;
  final String orderId;
  final String merchantCode;
  final String statusWebhookUrl;
  final String userId;
  final bool autoConfirm;
  final bool testEnvironment;

  const CryptoPayment({
    super.key,
    required this.amountCents,
    required this.orderDescription,
    required this.orderId,
    required this.merchantCode,
    this.userId = '',
    this.statusWebhookUrl = '',
    this.autoConfirm = false,
    this.testEnvironment = false,
  });

  @override
  State<CryptoPayment> createState() => _CryptoPaymentState();
}

class _CryptoPaymentState extends State<CryptoPayment> {
  late WebViewController controller;
  bool isLoading = true;

  Uri get baseUri {
    if (widget.testEnvironment) {
      return Uri.parse(
        'https://pay.staging.cryptoqr.net/',
      );
    }
    return Uri.parse(
      'https://pay.cryptoqr.net/',
    );
  }

  Uri get paymentLink {
    final uri = baseUri.replace(queryParameters: {
      'amountCents': widget.amountCents.toString(),
      'description': widget.orderDescription,
      'orderId': widget.orderId,
      'merchantCode': widget.merchantCode,
      'userId': widget.userId.isEmpty ? Uuid().v4() : widget.userId,
      'statusWebhookUrl': widget.statusWebhookUrl,
      'autoConfirm': widget.autoConfirm.toString(),
    });
    return uri;
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        WebViewWidget(controller: controller),
        isLoading
            ? const Center(
                child: CircularProgressIndicator(),
              )
            : const Stack(),
      ],
    );
  }

  @override
  void initState() {
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (String url) {
            if (!context.mounted) return;
            setState(() {
              isLoading = false;
            });
          },
        ),
      );
    controller.loadRequest(paymentLink);
    super.initState();
  }
}
