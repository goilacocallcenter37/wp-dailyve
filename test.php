<?php 

function handle_choose_trip_ajax_booking()
{
    check_ajax_referer('ams_vexe', 'nonce');
    $lockSeat = isset($_POST['lockSeat']) ? sanitize_text_field($_POST['lockSeat']) : "";
    $partnerId = isset($_POST['partnerId']) ? sanitize_text_field($_POST['partnerId']) : null;
    $tripCode = isset($_POST['tripCode']) ? sanitize_text_field($_POST['tripCode']) : '';
    $from = isset($_POST['from']) ? sanitize_text_field($_POST['from']) : '';
    $to = isset($_POST['to']) ? sanitize_text_field($_POST['to']) : '';
    $fare = isset($_POST['fare']) ? intval($_POST['fare']) : 0;
    $pickupDate = isset($_POST['pickupDate']) ? sanitize_text_field($_POST['pickupDate']) : '';
    $wayId = isset($_POST['wayId']) ? sanitize_text_field($_POST['wayId']) : '';
    $bookingId = isset($_POST['bookingId']) ? sanitize_text_field($_POST['bookingId']) : '';

    $body = array(
        "lockSeat" => $lockSeat,
        "tripId" => $tripCode,
        "partnerId" => $partnerId,
        "from" => $from,
        "to" => $to,
        "wayId" => $wayId,
        "bookingId" => $bookingId,
        "fare" => $fare,
        "pickupDate" => $pickupDate,
    );

    $response = call_api_with_token_agent(endPoint . '/api/trip/get-trip-detail', 'POST', $body);
    $output = '';
    $seatsList = [];
    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
    } else {
        $data = json_decode(wp_remote_retrieve_body($response), true);

        if (!empty($data) && is_array($data)) {
            $seatGroups = [];
            $templates = $data['data']['coach_seat_template'];

            $seat_group_list = [];
            $seat_group_list_2 = [];

            foreach ($templates as $template) {
                foreach ($template['seats'] as $seat) {
                    $groupCode = $seat['seat_group_code'];
                    if (!isset($seatGroups[$groupCode])) {
                        $seatGroups[$groupCode] = [
                            'name' => $seat['seat_group'],
                            'color' => $seat['seat_color'],
                            'type' => $seat['seat_type'],
                            'price' => $seat['fare'],
                            'originalPrice' => $seat['fares']['original'],
                            'isDiscount' => $seat['fare'] < $seat['fares']['original'],
                        ];
                    }



                    $seat_group_item = [
                        'seat_group_code' => $seat['seat_group_code'],
                        'name' => $seat['seat_group'],
                        'color' => $seat['seat_color'],
                        'type' => $seat['seat_type'],
                        'price' => $seat['fare'],
                        'originalPrice' => $seat['fares']['original'],
                        'isDiscount' => $seat['fare'] < $seat['fares']['original']
                    ];

                    $seat_group_list[] = $seat_group_item;
                    $seat_group_list_2[] = $seat_group_item;

                    $seat_groups = $seat['seat_groups'];
                    foreach ($seat_groups as $seat_group) {
                        $seat_group_item = [
                            'seat_group_code' => $seat_group['seat_group_code'],
                            'name' => $seat_group['seat_group'],
                            'color' => $seat_group['seat_color'],
                            'type' => $seat['seat_type'],
                            'price' => $seat_group['fare'],
                            'originalPrice' => $seat_group['fares']['original'],
                            'isDiscount' => $seat_group['fare'] < $seat_group['fares']['original']
                        ];
                        $seat_group_list_2[] = $seat_group_item;
                    }
                }
            }

            $seat_group_list = array_map('unserialize', array_unique(array_map('serialize', $seat_group_list)));
            $seat_group_list_2 = array_map('unserialize', array_unique(array_map('serialize', $seat_group_list_2)));
            $new_seat_group_list = [];

            foreach ($seat_group_list_2 as $item_1) {
                $flag = 0;
                foreach ($seat_group_list as $item_2) {
                    if ($item_1['seat_group_code'] == $item_2['seat_group_code']) {
                        $new_seat_group_list[] = $item_1;
                        $flag = 1;
                    }
                }
                if ($flag == 0) {
                    $item_1['is_not_icon'] = 1;
                    $new_seat_group_list[] = $item_1;
                }
            }

            $output = '<div>
                <img class="BookingDetail__IconClose" src="/wp-content/uploads/assets/images/iconCloseInfo.svg" alt="icon close" onClick="handleSeatClose();"/>
                <form id="multi-step-form">
                                    <div class="step-form-content">
                                        <div class="step active" id="step1">
                                            <div class="step-count">
                                                <div class="steps-item-count-icon">1</div>
                                                <h3>Chỗ mong muốn</h3>
                                            </div>
                                            <div class="trust-message-container trust">
                                                <i class="fas fa-shield-alt"></i>
                                                <p class="trust-message-content">Dailyve cam kết giữ đúng chỗ bạn đã chọn.</p>
                                            </div>
                                            <div class="steps-content">
                                                <div class="seat-selection-online__seat-selection">
                                                    <div class="seat-groups">
                                                        <div class="note">Chú thích</div>';
            $output .= renderTopSeatTemplateNote($data['data']['coach_seat_template'][0]['seats'][0]['seat_type'], '#B8B8B8');

            foreach ($new_seat_group_list as $code => $info) {
                $seatTemp = renderSeatTemplate($info['type'], $info['color'], true, $info, 1, $info['is_not_icon']);
                $output .= $seatTemp;
            }

            $output .= '</div>
                            </div>
                        <div class="steps-template-container">';
            foreach ($data['data']['coach_seat_template'] as $key => $coachs) {
                $coachRow = $coachs['num_rows'];
                $coachCol = $coachs['num_cols'];
                $output .= '<div class="coach-container">';
                $output .= '<span>' . esc_html($coachs['coach_name']) . '</span>';
                $output .= "<div class='coach' style='grid-template-columns: repeat($coachCol, 1fr); grid-template-rows: repeat($coachRow, 1fr);'>";
                $seatsList[$key] = $coachs['seats'];
                $seatFares = "";
                foreach ($coachs['seats'] as $seat) {
                    $seatCol = $seat['col_num'];
                    $seatRow = $seat['row_num'];
                    if (!empty($seat['seat_groups']) && is_array($seat['seat_groups'])) {
                        $fares = array_filter(array_map(function ($item) {
                            return $item['fare'] ? number_format($item['fare'], 0, ",", ".") : null;
                        }, $seat['seat_groups']));
                        $seatFares = implode(', ', $fares);
                    } else {
                        $seatFares = number_format($seat['fare'], 0, ",", ".");
                    }
                    switch ($seat['seat_type']) {
                        case 1:
                            $seatColor = $seat['seat_color'] ?? '#B8B8B8';
                            $seatTemplate = renderSeatTemplate($seat['seat_type'], $seatColor, isAvailable: $seat['is_available']);
                            break;
                        case 7:
                            $seatColor = $seat['seat_color'] ?? '#B8B8B8';
                            $seatTemplate = renderSeatTemplate($seat['seat_type'], $seatColor, isAvailable: $seat['is_available']);
                            break;
                        case 2:
                            $seatColor = $seat['seat_color'] ?? '#B8B8B8';
                            $seatTemplate = renderSeatTemplate($seat['seat_type'], $seatColor, isAvailable: $seat['is_available']);
                            break;
                        case 3:
                            $seatColor = $seat['seat_color'] ?? '#B8B8B8';
                            $seatTemplate = renderSeatTemplate($seat['seat_type'], $seatColor, isAvailable: $seat['is_available']);
                            break;
                        default:
                            $seatColor = $seat['seat_color'] ?? '#B8B8B8';
                            $seatTemplate = renderSeatTemplate($seat['seat_type'], $seatColor, isAvailable: $seat['is_available']);
                            break;
                    }
                    $unavailable = !$seat['is_available'] ? 'unavailable' : '';
                    $seatCode = (string) esc_html(json_encode($seat['seat_code']));
                    $fullSeatCode = (string) esc_html(json_encode($seat['full_code']));
                    // $seatData = esc_html(json_encode($seat));
                    $output .= '<div class="seat ' . $unavailable . '" style="grid-area:' . $seatRow . '/' . $seatCol . '/' . ($seatRow + 1) . '/' . ($seatCol + 1) . ';" onClick="handleSeatClick(this, ' . $seatCode . ', ' . $fullSeatCode . ')"> 
                            <div class="tooltip"> 
                                <div>' . $seatTemplate . '</div>
                                <span class="tooltiptext tooltip-top">Số ghế: ' . esc_html($seat['seat_code']) . ' - Giá: ' . $seatFares . '</span>
                        </div>
                    </div>';
                }
                $output .= "</div></div>";
            }
            $output .= '</div>
                                        </div>
                                            <div class="form-footer-action">
                                                <div class="form-footer-left"></div>
                                                <div class="form-footer-right">
                                                    <div class="footer-price-seat"></div>
                                                    <button type="button" class="next-step" id="next-step-1">Tiếp tục</button>
                                            </div>
                                        </div>
                                        </div>
                                        <div class="step" id="step2">
                                            <div class="step-count">
                                                <div class="steps-item-count-icon">2</div>
                                                <h3>Điểm đón trả</h3>
                                            </div>
                                            <div class="trust-message-container trust">
                                                <i class="fas fa-shield-alt"></i>
                                                <p class="trust-message-content">An tâm được đón đúng nơi, trả đúng chỗ đã chọn và dễ dàng thay đổi khi cần.</p>
                                            </div>
                                            <div class="section-tabs-point">
                                                <div class="point-tab point-tab-pickup active">Điểm đón</div>
                                                <div class="point-tab point-tab-dropoff">Điểm trả</div>
                                            </div>
                                            <div class="steps-content">
                                                <div class="area_point_selection__wrapper">
                                                    <div class="content-pickup-point">
                                                        <div class="topbar__content">
                                                            <p class="point-type">Điểm đón</p>
                                                            <div class="label-container">
                                                                <p class="hTYbup">Sắp xếp theo</p>
                                                                <div class="value-container">
                                                                    <div style="position: relative;">
                                                                        <select class="select-time" onChange="sortListPickUpPoint();">
                                                                        <option>Sớm nhất</option>
                                                                            <option>Muộn nhất</option>
                                                                        </select>
                                                                        <i class="fas fa-sort-down right-arrow-select"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                        <div class="content-list-point" id="list-pickup-point">';
            usort($data['data']['pickup_points'], 'compareByRealTime');
            foreach ($data['data']['pickup_points'] as $point) {
                $pointData = json_encode($point);
                $encodedData = base64_encode($pointData);
                $address = '';
                $note = $point['note'] != null ? $point['note'] : null;
                $minCustomer = $point['min_customer'];
                $minCustomerTxt = "";
                $data_mincustomer = "data-min-customer=1";
                if ($minCustomer != null && $minCustomer > 1) {
                    $minCustomerTxt = "<div class='point-note-2'>Đặt từ $minCustomer ghế trở lên để chọn được điểm này</div>";
                    $data_mincustomer = "data-min-customer=$minCustomer";
                } else {
                    $minCustomerTxt = "";
                }

                $surcharge = $point['surcharge'] != null ? $point['surcharge'] : 0;
                $surcharge_tiers = $point['surcharge_tiers'] != null ? $point['surcharge_tiers'] : '[]';
                $surcharge_method = "";
                $surcharge_type = 0;
                if ($surcharge != null && $surcharge != 0) {
                    $surcharge_type = $point['surcharge_type'] != null ? $point['surcharge_type'] : 0;
                    if ($surcharge_type == 1) {
                        $surcharge_method = "Khách hàng thanh toán phụ thu sau với nhà xe";
                    } elseif ($surcharge_type == 2) {
                        $surcharge_method = "Khách hàng thanh toán phụ thu trước cùng với tiền vé";
                    }
                }

                $unfixed_point = $point['unfixed_point'] != null ? $point['unfixed_point'] : 0;
                $unfixed_point_input = "";
                if ($unfixed_point == 1) {
                    $unfixed_point_input = "<input disabled type='text' placeholder='Nhập địa chỉ' name='pickup_point_more_desc'>";
                }

                $transfer_attr = "";
                $transfer_txt = "";
                // $transfer_real_time = $point['transfer_disabled_real_time'] != null ? $point['transfer_disabled_real_time'] : null;
                // if($transfer_real_time != null) {
                //     date_default_timezone_set('Asia/Ho_Chi_Minh');
                //     $targetTime = DateTime::createFromFormat('H:i d-m-Y', $transfer_real_time);
                //     $now = new DateTime();
                //     if($targetTime < $now) {
                //         $transfer_attr = "data-transfer='disabled'";
                //         $transfer_txt = "Đã quá thời gian để chọn điểm này";
                //     }
                // }


                if (!empty($point['address'])) {
                    $address = esc_html($point['address']);
                } else {
                    if (!empty($point["areaDetail"]["ward_name"])) {
                        $address .= esc_html($point["areaDetail"]["ward_name"]) . ', ';
                    }
                    if (!empty($point["areaDetail"]["city_name"])) {
                        $address .= esc_html($point["areaDetail"]["city_name"]) . ', ';
                    }
                    if (!empty($point["areaDetail"]["state_name"])) {
                        $address .= esc_html($point["areaDetail"]["state_name"]) . ', ';
                    }
                }
                $output .= '<div class="item-list-point"' . $data_mincustomer . '>
                                                                <label for="pickup-' . esc_html($point["id"]) . '" class="point-title">
                                                                    <input ' . $transfer_attr . ' data-point-type="pickup-point" class="data-pickup-point" type="radio" id="pickup-' . esc_html($point["id"]) . '" name="pickup-point" data-point="' . $encodedData . '" onChange="handleChangePichUp(this);" data-surcharge-type=' . $surcharge_type . ' data-surcharge=' . $surcharge . ' data-surcharge-tiers=' . $surcharge_tiers . '>
                                                                    <strong>' . getTime($point["real_time"]) . '</strong>
                                                                </label>
                                                                <div class="content">
                                                                    <div>
                                                                        <strong>' . esc_html($point["name"]) . '</strong>
                                                                        <div style="color: rgb(133, 133, 133);">' . $address . '</div>
                                                                        <div class="point-note">' . $note . '</div>' . $minCustomerTxt .
                    '<div class="content-surcharge-price"></div><div class="content-surcharge-method">' . $surcharge_method . '</div><div class="pickup-point-more-desc">' . $unfixed_point_input . '</div><div class="point-note-3">' . $transfer_txt . '</div>
                                                                    </div>
                                                                    <div>
                                                                        <i class="fas fa-map-marker-alt"></i>
                                                                        <span class="viewmap-link" data-name="' . esc_html($point["name"]) . '" data-long="' . esc_html($point["areaDetail"]["longitude"]) . '" data-lat="' . esc_html($point["areaDetail"]["latitude"]) . '" onClick="viewMap(this);">Bản đồ</span>
                                                                    </div>
                                                                </div>
                                                             </div>';
            }


            $output .= '</div>';


            //Pickup Transfer Points

            $pickup_transfer_status = $data['data']['transfer_enable'];
            $pickup_transfer_points = $data['data']['transfer_points'];

            if ($pickup_transfer_status == 1 && !empty($pickup_transfer_points)) {
                $output .= '<p><strong>Điểm đón trung chuyển</strong></p>';
                $output .= '<div class="content-list-point" id="list-pickup-transfer-point">';
                foreach ($pickup_transfer_points as $point) :

                    $pointData = json_encode($point);
                    $encodedData = base64_encode($pointData);
                    $address = '';
                    $note = $point['note'] ? $point['note'] : null;

                    $minCustomer = $point['min_customer'];
                    $minCustomerTxt = "";
                    $data_mincustomer = "data-min-customer=1";
                    if ($minCustomer != null && $minCustomer > 1) {
                        $minCustomerTxt = "<div class='point-note-2'>Đặt từ $minCustomer ghế trở lên để chọn được điểm này</div>";
                        $data_mincustomer = "data-min-customer=$minCustomer";
                    } else {
                        $minCustomerTxt = "";
                    }

                    $surcharge = $point['surcharge'] != null ? $point['surcharge'] : 0;
                    $surcharge_tiers = $point['surcharge_tiers'] != null ? $point['surcharge_tiers'] : '[]';
                    $surcharge_method = "";
                    $surcharge_type = 0;
                    if ($surcharge != null && $surcharge != 0) {
                        $surcharge_type = $point['surcharge_type'] != null ? $point['surcharge_type'] : 0;
                        if ($surcharge_type == 1) {
                            $surcharge_method = "Khách hàng thanh toán phụ thu sau với nhà xe";
                        } elseif ($surcharge_type == 2) {
                            $surcharge_method = "Khách hàng thanh toán phụ thu trước cùng với tiền vé";
                        }
                    }


                    $unfixed_point = $point['unfixed_point'] != null ? $point['unfixed_point'] : 0;
                    $unfixed_point_input = "";
                    if ($unfixed_point == 1) {
                        $unfixed_point_input = "<input disabled type='text' placeholder='Nhập địa chỉ' name='pickup_point_more_desc'>";
                    }


                    $transfer_attr = "";
                    $transfer_txt = "";
                    $transfer_real_time = $point['transfer_disabled_real_time'] != null ? $point['transfer_disabled_real_time'] : null;
                    if ($transfer_real_time != null) {
                        date_default_timezone_set('Asia/Ho_Chi_Minh');
                        $targetTime = DateTime::createFromFormat('H:i d-m-Y', $transfer_real_time);
                        $now = new DateTime();
                        if ($targetTime < $now) {
                            $transfer_attr = "data-transfer='disabled'";
                            $transfer_txt = "Đã quá thời gian để chọn điểm này";
                        }
                    }


                    if (!empty($point['address'])) {
                        $address = esc_html($point['address']);
                    } else {
                        if (!empty($point["areaDetail"]["ward_name"])) {
                            $address .= esc_html($point["areaDetail"]["ward_name"]) . ', ';
                        }
                        if (!empty($point["areaDetail"]["city_name"])) {
                            $address .= esc_html($point["areaDetail"]["city_name"]) . ', ';
                        }
                        if (!empty($point["areaDetail"]["state_name"])) {
                            $address .= esc_html($point["areaDetail"]["state_name"]) . ', ';
                        }
                    }

                    $output .= '<div class="item-list-point"' . $data_mincustomer . '>
                            <label for="pickup-transfer-' . esc_html($point["id"]) . '" class="point-title">
                                <input ' . $transfer_attr . 'data-point-type="transfer-point" class="data-pickup-point" type="radio" id="pickup-transfer-' . esc_html($point["id"]) . '" name="pickup-point" data-point="' . $encodedData . '" onChange="handleChangePichUp(this);" data-surcharge-type=' . $surcharge_type . ' data-surcharge=' . $surcharge . ' data-surcharge-tiers=' . $surcharge_tiers . '>
                                <strong>' . getTime($point["real_time"]) . '</strong>
                            </label>
                            <div class="content">
                                <div>
                                    <strong>' . esc_html($point["name"]) . '</strong>
                                    <div style="color: rgb(133, 133, 133);">' . $address . '</div>
                                    <div class="content-note">' . $note . '</div>' . $minCustomerTxt .
                        '<div class="content-surcharge-price"></div><div class="content-surcharge-method">' . $surcharge_method . '</div><div class="pickup-point-more-desc">' . $unfixed_point_input . '</div><div class="point-note-3">' . $transfer_txt . '</div>
                                </div>
                                <div>
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span class="viewmap-link" data-name="' . esc_html($point["name"]) . '" data-long="' . esc_html($point["areaDetail"]["longitude"]) . '" data-lat="' . esc_html($point["areaDetail"]["latitude"]) . '" onClick="viewMap(this);">Bản đồ</span>
                                </div>
                            </div>
                        </div>';

                endforeach;
                $output .= '</div>';
            }

            $output .= '</div>
                                                    <div class="content-dropoff-point">
                                                        <div class="topbar__content">
                                                            <p class="point-type">Điểm trả</p>
                                                            <div class="label-container">
                                                                <p class="hTYbup">Sắp xếp theo</p>
                                                                <div class="value-container">
                                                                    <div style="position: relative;">
                                                                        <select class="select-time" onChange="sortListDropOffPoint();">
                                                                            <option>Sớm nhất</option>
                                                                            <option>Muộn nhất</option>
                                                                        </select>
                                                                        <i class="fas fa-sort-down right-arrow-select"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="content-list-point" id="list-dropoff-point">';
            usort($data['data']['drop_off_points_at_arrive'], 'compareByRealTime');
            foreach ($data['data']['drop_off_points_at_arrive'] as $point) {
                $pointData = json_encode($point);
                $encodedData = base64_encode($pointData);
                $address = '';
                $note = $point['note'] != null ? $point['note'] : null;


                $minCustomer = $point['min_customer'];
                $minCustomerTxt = "";
                $data_mincustomer = "data-min-customer=1";
                if ($minCustomer != null && $minCustomer > 1) {
                    $minCustomerTxt = "<div class='point-note-2'>Đặt từ $minCustomer ghế trở lên để chọn được điểm này</div>";
                    $data_mincustomer = "data-min-customer=$minCustomer";
                } else {
                    $minCustomerTxt = "";
                }

                $surcharge = $point['surcharge'] != null ? $point['surcharge'] : 0;
                $surcharge_tiers = $point['surcharge_tiers'] != null ? $point['surcharge_tiers'] : '[]';
                $surcharge_method = "";
                $surcharge_type = 0;
                if ($surcharge != null && $surcharge != 0) {
                    $surcharge_type = $point['surcharge_type'] != null ? $point['surcharge_type'] : 0;
                    if ($surcharge_type == 1) {
                        $surcharge_method = "Khách hàng thanh toán phụ thu sau với nhà xe";
                    } elseif ($surcharge_type == 2) {
                        $surcharge_method = "Khách hàng thanh toán phụ thu trước cùng với tiền vé";
                    }
                }

                $unfixed_point = $point['unfixed_point'] != null ? $point['unfixed_point'] : 0;
                $unfixed_point_input = "";
                if ($unfixed_point == 1) {
                    $unfixed_point_input = "<input disabled type='text' placeholder='Nhập địa chỉ' name='dropoff_point_more_desc'>";
                }



                $transfer_attr = "";
                $transfer_txt = "";
                // $transfer_real_time = $point['transfer_disabled_real_time'] != null ? $point['transfer_disabled_real_time'] : null;
                // if($transfer_real_time != null) {
                //     date_default_timezone_set('Asia/Ho_Chi_Minh');
                //     $targetTime = DateTime::createFromFormat('H:i d-m-Y', $transfer_real_time);
                //     $now = new DateTime();
                //     if($targetTime < $now) {
                //         $transfer_attr = "data-transfer='disabled'";
                //         $transfer_txt = "Đã quá thời gian để chọn điểm này";
                //     }
                // }


                if (!empty($point['address'])) {
                    $address = esc_html($point['address']);
                } else {
                    if (!empty($point["areaDetail"]["ward_name"])) {
                        $address .= esc_html($point["areaDetail"]["ward_name"]) . ', ';
                    }
                    if (!empty($point["areaDetail"]["city_name"])) {
                        $address .= esc_html($point["areaDetail"]["city_name"]) . ', ';
                    }
                    if (!empty($point["areaDetail"]["state_name"])) {
                        $address .= esc_html($point["areaDetail"]["state_name"]) . ', ';
                    }
                }
                $output .= '<div class="item-list-point"' . $data_mincustomer . '>
                                                                <label for="dropoff-' . esc_html($point["id"]) . '" class="point-title">
                                                                    <input ' . $transfer_attr . ' data-point-type="dropoff-point" class="data-dropoff-point" type="radio" id="dropoff-' . esc_html($point["id"]) . '" name="dropoff-point" data-point="' . $encodedData . '" onChange="handleChangeDropOff(this);" data-surcharge-type=' . $surcharge_type . ' data-surcharge=' . $surcharge . ' data-surcharge-tiers=' . $surcharge_tiers . '>
                                                                    <strong>' . getTime($point["real_time"]) . '</strong>
                                                                </label>
                                                                <div class="content">
                                                                    <div>
                                                                        <strong>' . esc_html($point["name"]) . '</strong>
                                                                        <div style="color: rgb(133, 133, 133);">' . $address . '</div>
                                                                        <div class="content-note">' . $note . '</div>' . $minCustomerTxt .
                                                            '<div class="content-surcharge-price"></div><div class="content-surcharge-method">' . $surcharge_method . '</div><div class="pickup-point-more-desc">' . $unfixed_point_input . '</div><div class="point-note-3">' . $transfer_txt . '</div>
                                                                    </div>
                                                                    <div>
                                                                        <i class="fas fa-map-marker-alt"></i>
                                                                        <span class="viewmap-link" data-name="' . esc_html($point["name"]) . '" data-long="' . esc_html($point["areaDetail"]["longitude"]) . '" data-lat="' . esc_html($point["areaDetail"]["latitude"]) . '" onClick="viewMap(this);">Bản đồ</span>
                                                                    </div>
                                                                </div>
                                                            </div>';
            }
            $output .= '</div>';



            //Dropoff Transfer Points

            $dropoff_transfer_status = $data['data']['transfer_at_arrive_enable'];
            $dropoff_transfer_points = $data['data']['transfer_points_at_arrive'];

            if ($dropoff_transfer_status == 1 && !empty($dropoff_transfer_points)) {
                $output .= '<p><strong>Điểm trả trung chuyển</strong></p>';
                $output .= '<div class="content-list-point" id="list-dropoff-transfer-point">';
                foreach ($dropoff_transfer_points as $point) :

                    $pointData = json_encode($point);
                    $encodedData = base64_encode($pointData);
                    $address = '';
                    $note = $point['note'] ? $point['note'] : null;

                    $minCustomer = $point['min_customer'];
                    $minCustomerTxt = "";
                    $data_mincustomer = "data-min-customer=1";
                    if ($minCustomer != null && $minCustomer > 1) {
                        $minCustomerTxt = "<div class='point-note-2'>Đặt từ $minCustomer ghế trở lên để chọn được điểm này</div>";
                        $data_mincustomer = "data-min-customer=$minCustomer";
                    } else {
                        $minCustomerTxt = "";
                    }

                    $surcharge = $point['surcharge'] != null ? $point['surcharge'] : 0;
                    $surcharge_tiers = $point['surcharge_tiers'] != null ? $point['surcharge_tiers'] : '[]';
                    $surcharge_method = "";
                    $surcharge_type = 0;
                    if ($surcharge != null && $surcharge != 0) {
                        $surcharge_type = $point['surcharge_type'] != null ? $point['surcharge_type'] : 0;
                        if ($surcharge_type == 1) {
                            $surcharge_method = "Khách hàng thanh toán phụ thu sau với nhà xe";
                        } elseif ($surcharge_type == 2) {
                            $surcharge_method = "Khách hàng thanh toán phụ thu trước cùng với tiền vé";
                        }
                    }


                    $unfixed_point = $point['unfixed_point'] != null ? $point['unfixed_point'] : 0;
                    $unfixed_point_input = "";
                    if ($unfixed_point == 1) {
                        $unfixed_point_input = "<input disabled type='text' placeholder='Nhập địa chỉ' name='dropoff_point_more_desc'>";
                    }

                    $transfer_attr = "";
                    $transfer_txt = "";
                    $transfer_real_time = $point['transfer_disabled_real_time'] != null ? $point['transfer_disabled_real_time'] : null;
                    if ($transfer_real_time != null) {
                        date_default_timezone_set('Asia/Ho_Chi_Minh');
                        $targetTime = DateTime::createFromFormat('H:i d-m-Y', $transfer_real_time);
                        $now = new DateTime();
                        if ($targetTime < $now) {
                            $transfer_attr = "data-transfer='disabled'";
                            $transfer_txt = "Đã quá thời gian để chọn điểm này";
                        }
                    }


                    if (!empty($point['address'])) {
                        $address = esc_html($point['address']);
                    } else {
                        if (!empty($point["areaDetail"]["ward_name"])) {
                            $address .= esc_html($point["areaDetail"]["ward_name"]) . ', ';
                        }
                        if (!empty($point["areaDetail"]["city_name"])) {
                            $address .= esc_html($point["areaDetail"]["city_name"]) . ', ';
                        }
                        if (!empty($point["areaDetail"]["state_name"])) {
                            $address .= esc_html($point["areaDetail"]["state_name"]) . ', ';
                        }
                    }

                    $output .= '<div class="item-list-point"' . $data_mincustomer . '>
                            <label for="dropoff-transfer-' . esc_html($point["id"]) . '" class="point-title">
                                <input ' . $transfer_attr . ' data-point-type="dropoff-transfer-point" class="data-dropoff-point" type="radio" id="dropoff-transfer-' . esc_html($point["id"]) . '" name="dropoff-point" data-point="' . $encodedData . '" onChange="handleChangeDropOff(this);" data-surcharge-type=' . $surcharge_type . ' data-surcharge=' . $surcharge . ' data-surcharge-tiers=' . $surcharge_tiers . '>
                                <strong>' . getTime($point["real_time"]) . '</strong>
                            </label>
                           <div class="content">
                                <div>
                                    <strong>' . esc_html($point["name"]) . '</strong>
                                    <div style="color: rgb(133, 133, 133);">' . $address . '</div>
                                    <div class="content-note">' . $note . '</div>' . $minCustomerTxt .
                        '<div class="content-surcharge-price"></div><div class="content-surcharge-method">' . $surcharge_method . '</div><div class="pickup-point-more-desc">' . $unfixed_point_input . '</div><div class="point-note-3">' . $transfer_txt . '</div>
                                </div>
                                <div>
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span class="viewmap-link" data-name="' . esc_html($point["name"]) . '" data-long="' . esc_html($point["areaDetail"]["longitude"]) . '" data-lat="' . esc_html($point["areaDetail"]["latitude"]) . '" onClick="viewMap(this);">Bản đồ</span>
                                </div>
                            </div>
                        </div>';

                endforeach;
                $output .= '</div>';
            }


            $output .= '
                                                     </div>
                                                </div>
                                            </div>
                                            <div class="form-footer-action">
                                                <div class="form-footer-prev">
                                                    <button type="button" class="prev-step"><i class="fas fa-chevron-left"></i>Quay lại</button>
                                                </div>
                                                <div class="form-footer-right">
                                                    <div class="footer-price-seat"></div>
                                                    <button type="button" class="next-step" id="next-step-2">Tiếp tục</button>
                                            </div>
                                        </div>
                                        </div>
                                        <div class="step" id="step3">
                                            <div class="step-count">
                                                <div class="steps-item-count-icon">3</div>
                                                <h3>Thông tin liên hệ</h3>
                                            </div>
                                            <div class="trust-message-container trust">
                                                <i class="fas fa-shield-alt"></i>
                                                <p class="trust-message-content">Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.</p>
                                            </div>
                                            <div class="steps-content">
                                                <div class="booking-confirmation__container">
                                                    <div class="wrap-left-info">
                                                        <form>
                                                            <div class="omrs-input-group">
                                                                <label class="omrs-input-underlined">
                                                                    <input required name="customer-name">
                                                                    <span class="omrs-input-label">Tên người đi <span style="color: red;">*</span></span>
                                                                    <span class="omrs-input-helper" id="msg-err-name"></span>
                                                                </label>
                                                            </div>
                                                            <div class="omrs-input-group">
                                                                <label class="omrs-input-underlined">
                                                                    <input required name="customer-phone">
                                                                    <span class="omrs-input-label">Số điện thoại <span style="color: red;">*</span></span>
                                                                    <span class="omrs-input-helper" id="msg-err-phone"></span>
                                                                </label>
                                                            </div>
                                                            <div class="omrs-input-group">
                                                                <label class="omrs-input-underlined">
                                                                    <input required name="customer-email">
                                                                    <span class="omrs-input-label">mail@example.com</span>
                                                                    <span class="omrs-input-helper" id="msg-err-email"></span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <textarea rows="3" style="width: 100%; border-radius: 8px;" placeholder="Ghi chú" name="customer-note"></textarea>
                                                            </div>
			                                            </form>
                                                    </div>
                                                    <div class="wrap-right-info">
                                                        <div class="section-info-ticket">
                                                            <div class="title-info-ticket">Thông tin chuyến đi</div>
                                                            <div class="content-info-ticket">
                                                                <div class="box-review-info-ticket-round-trip__container">
                                                                    <div class="section-ticket-header">
                                                                        <div class="section-ticket-header-left">
                                                                            <img src="/wp-content/uploads/assets/images/bus_blue_24dp.svg" alt="bus icon" width="16" height="16">
                                                                            <p class="base_text date-ticket-info">T5, 22/08/2024</p>
                                                                            <div class="total-ticket">
                                                                                <img src="/wp-content/uploads/assets/images/people_alt_black_24dp.svg" alt="total icon" width="16" height="16">
                                                                                <p class="base_text_1"></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="section-ticket-content">
                                                                        <div class="section-ticket-company-info">
                                                                            <div>
                                                                                <img src="https://static.vexere.com/production/images/1584418537685.jpeg" alt="Avatar">
                                                                            </div>
                                                                            <div class="section-ticket-company-info-name">
                                                                                <p class="base_text"></p>
                                                                                <p class="base_text_1"></p>
                                                                            </div>
                                                                        </div>
                                                                        <div class="box-ticket-route-detail-container">
                                                                            <div class="section-route-info">
                                                                                <div class="area-point-detail-round-trip__container">
                                                                                    <div class="date-time-container">
                                                                                        <div class="date-time-container-pick-up time-pick-up">
                                                                                            <div class="base__Headline01"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="icon-container">
                                                                                        <div class="icon-container-top">
                                                                                            <img class="pickup-icon" src="/wp-content/uploads/assets/images/pickup_vv_blue_24dp.svg" alt="pickup-icon" width="12" height="12">
                                                                                        </div>
                                                                                        <div class="icon-container-divider">
                                                                                            <div class="icon-container-divider-border-right"></div>
                                                                                            <div class="icon-container-divider-border-left"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="section-area">
                                                                                        <div class="section-area-picker pickup-point-name">
                                                                                            <p class="base_text mb-5"></p>
                                                                                            <p class="base_text_2"></p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="area-point-detail-round-trip__container">
                                                                                    <div class="date-time-container">
                                                                                        <div class="date-time-container-pick-up time-drop-off mb-0">
                                                                                            <div class="base__Headline01"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="icon-container">
                                                                                        <div class="icon-container-divider">
                                                                                            <div class="icon-container-divider-border-right"></div>
                                                                                            <div class="icon-container-divider-border-left"></div>
                                                                                        </div>
                                                                                        <div class="icon-container-bottom">
                                                                                            <img class="pickup-icon" src="/wp-content/uploads/assets/images/dropoff_semantic_negative_12dp.svg" alt="dropoff-icon" width="12" height="12">
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="section-area">
                                                                                        <div class="section-area-picker dropoff-point-name">
                                                                                            <p class="base_text mb-5"></p>
                                                                                            <p class="base_text_2"></p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-footer-action">
                                                <div class="form-footer-prev">
                                                    <button type="button" class="prev-step"><i class="fas fa-chevron-left"></i>Quay lại</button>
                                                </div>
                                                <div class="form-footer-right">
                                                    <div class="footer-price-seat"></div>
                                                    <button type="button" class="submit-step" id="next-step-3">Đặt chỗ</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                </div>';
            foreach ($data['data']['stage_fares'] as &$item) {
                if (isset($item['group_fares']) && empty($item['group_fares'])) {
                    $item['group_fares'] = (object)[];
                }
            }
            $response = [
                'html' => $output,
                'seats' => $seatsList,
                'data' => $data['data'],
            ];
            wp_send_json_success($response);
        }
    }
    wp_die();
}